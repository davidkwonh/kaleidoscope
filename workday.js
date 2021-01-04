import {PROFILE, moveclick, existsclass, existselementid, existsquery,
existstag, trytype, pollDOM} from "./main.js"
/// <reference path="jquery-3.5.1.js"/>

var inputevent = new Event('input', {
    bubbles: true,
    cancelable: true,
});

// Helper function to handle workday events. Fills out an input field and updates the value with site JS.
function changevalue(element, stringval) {
    element.value = stringval;
    element.dispatchEvent(inputevent);
}

function trytypexpath(xpath, stringval) {
    ele = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
    if (ele) {
        ele.value = stringval;
        ele.dispatchEvent(inputevent);
    }
}


// Trytype for Workday apps using querySelector
function trytypeworkday(query, stringval) {
    if (existsquery(query)) {
        var element = document.querySelector(query);
        element.value = stringval;
        element.dispatchEvent(inputevent);
    }
}

// Trytype for Workday Listed Inputs
function trytypelist(xpath, posn, stringval) {
    var ele = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(posn);
    if (ele) {
        ele.value = stringval;
        ele.dispatchEvent(inputevent);
    }
} 

function dropdownSelect(xpath1, xpath2) {
    var dropdown = document.evaluate(xpath1, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
    dropdown.click()
    pollDOM(xpath2, document.evaluate(xpath2, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click())
} 

function login() {
    var version = "none"
    var emailfield = document.querySelector("input[data-automation-id=email]");
    var passwordfield = document.querySelector("input[data-automation-id=password]"); 
    if (existsquery("input[data-automation-id=email]")) {
        version = "modern";
    } else {
        emailfield = document.querySelector("input[aria-label=Email Address]");
        passwordfield = document.querySelector("input[aria-label=Password]");
        version = "archaic"
    }
    changevalue(emailfield, PROFILE.email);
    changevalue(passwordfield, PROFILE.password);
    moveclick('div[data-automation-id=click_filter]');
    setTimeout(function() {
        var currenttext = document.getElementsByTagName("body")[0].innerText;
        if (currenttext.includes("ERROR: Invalid Username/Password")) {
            register(version);
        }
    }, 2000);
}

function register(version) {
    if (version == "modern") {
        document.querySelector("[data-automation-id=createAccountLink]").click();
        } 
        function modern() {
            if (existsquery('[data-automation-id=email')) {
                changevalue(document.querySelector('[data-automation-id=email'), PROFILE.email)
            }
            if (existsquery('[data-automation-id=userName')) {
                changevalue(document.querySelector('[data-automation-id=userName'), PROFILE.email)
            }
            changevalue(document.querySelector('[data-automation-id=password'), PROFILE.password)
            if (existsquery('[data-automation-id=verifyPassword]')) {
                changevalue(document.querySelector('[data-automation-id=verifyPassword]'), PROFILE.password)
            }
            if (existsquery('[data-automation-id=confirmPassword]')) {
                changevalue(document.querySelector('[data-automation-id=confirmPassword]'), PROFILE.password)
            }
            if (existsquery('[data-automation-id=createAccountCheckbox]')) {
                document.querySelector('[data-automation-id=createAccountCheckbox').click();
            }
            document.querySelector('[data-automation-id=click_filter]').click()
        }
        setTimeout(modern, 2000);
    if (version == "archaic") {
        const accountclick = document.evaluate('//*[(text()="Create Account")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        accountclick.click();
        function archaic() {
            if (existsquery('[aria-label=Email Address')) {
                changevalue(document.querySelector('[aria-label=Email Address'), PROFILE.email);
            }
            changevalue(document.querySelector('[aria-label=Password'), PROFILE.password);
            if (existsquery('[aria-label=Verify New Password]')) {
                changevalue(document.querySelector('[aria-label=Verify New Password]'), PROFILE.password);
            }
            if (existsquery('[data-automation-id=checkboxPanel]')) {
                document.querySelector('[data-automation-id=checkboxPanel]').click();
            }
            document.querySelector('[data-automation-id=click_filter]').click();
        }
        setTimeout(archaic, 2000);
    }
}

// Having problems with string parsing literal quotations into encapsulated_state
function personalinfo(nav, form) {
    var encapsulated_state = "\"" + PROFILE.state + "\"";
    function clickonstate() {
        var targetstate = document.evaluate('//div[contains(text(), "California")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        targetstate.click();
    }
    if (form == "default") { //we don't want to rely on page ordering if we don't have to, so this is the default.
        trytypeworkday('[data-automation-id="legalNameSection_firstName"]', PROFILE.first_name);
        trytypeworkday('[data-automation-id="legalNameSection_primary"]', PROFILE.last_name);
        trytypeworkday('[data-automation-id="addressSection_addressLine1"]', PROFILE.address);
        trytypeworkday('[data-automation-id="addressSection_city"]', PROFILE.city);
        trytypeworkday('[data-automation-id="addressSection_postalCode"]', PROFILE.zip_code);
        trytypeworkday('[data-automation-id="phone-number"]', PROFILE.phone);
        const state = document.evaluate('//label[contains(text(), "State")]//following::button[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        state.click();
        setTimeout(clickonstate, 800);
        // pollDOM('//div[contains(text(),' + encapsulated_state + ')]', clickonstate);
    }
    if (form == "custom") { 
        const firstname = document.evaluate('//*[contains(text(), "First Name")]//following::input[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        const lastname = document.evaluate('//*[contains(text(), "Last Name")]//following::input[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        changevalue(firstname, PROFILE.firstname);
        changevalue(lastname, PROFILE.lastname);
        const address = document.evaluate("//*[contains(text(), 'Address Line 1')]//following::input[1]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        const city = document.evaluate("//*[contains(text(), 'City')]//following::input[1]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        const zipcode = document.evaluate("//*[contains(text(), 'Postal Code')]//following::input[1]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        const state = document.evaluate('//label[contains(text(), "State")]//following::div[2]//div[1]//div[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        changevalue(address, PROFILE.address);
        changevalue(city, PROFILE.city);
        changevalue(zipcode, PROFILE.zip_code);
        state.click();
        setTimeout(clickonstate, 800);
        // pollDOM('//div[contains(text(),' + encapsulated_state + ')]', clickonstate);
        const phone = document.evaluate("//*[contains(text(), 'Phone Number')]//following::input[1]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0);
        changevalue(phone, PROFILE.phone);
    }
    //done, send notification and wait for next page, then call workday func
    return workday(nav, form);
}

function experience(nav, form) {
    var datecount = 1;
    var currenttext = document.getElementsByTagName("body")[0].innerText;
    var edusection = false;
    var langsection = false;
    if (form == "default") {
        if (currenttext.includes("Job Title") == false) {
            document.querySelector("[aria-label='Add Work Experience']").click();
        function defaultfunc() {
            trytypeworkday('[data-automation-id="jobTitle"]', PROFILE.job_title1);
            trytypeworkday('[data-automation-id="company"]', PROFILE.employer1);
            trytypeworkday('[data-automation-id="location"]', PROFILE.job_location1);
            trytypeworkday('[data-automation-id="description"]', PROFILE.job_desc1);
            trytypelist('//*[contains(text(), "Work Experience")]//following::*[@data-automation-id="dateInputWrapper"]', 0, PROFILE.job_start_month1 + PROFILE.job_start_year1);
            if (PROFILE.current_job1 == 1) {
                document.querySelector('[data-automation-id="currentlyWorkHere"]').click()
            } else {
                trytypelist('//*[@data-automation-id="dateInputWrapper"]', datecount, PROFILE.job_end_month1 + PROFILE.job_end_year1);
                datecount += 1;
            }
            if (PROFILE.employer2 != "") {
                pollDOM('//*[@aria-label="Add Another Work Experience"]', function() {
                    document.querySelector('[aria-label="Add Another Work Experience"]').click()
                    pollDOM('(//*[@data-automation-id="jobTitle"])[2]', function() {
                        trytypelist('//*[@data-automation-id="jobTitle"]', 1, PROFILE.job_title2);
                        trytypelist('//*[@data-automation-id="company"]', 1, PROFILE.employer2);
                        trytypelist('//*[@data-automation-id="location"]', 1, PROFILE.job_location2);
                        trytypelist('//*[@data-automation-id="description"]', 1, PROFILE.job_desc2);
                        trytypelist('//*[@data-automation-id="dateInputWrapper"]', datecount, PROFILE.job_start_month2 + PROFILE.job_start_year2);
                        datecount += 1;
                        if (PROFILE.current_job2 == 1) {
                            document.evaluate('//*[@data-automation-id="currentlyWorkHere"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(1).click();
                        } else {
                            trytypelist('//*[@data-automation-id="dateInputWrapper"]', datecount, PROFILE.job_end_month2 + PROFILE.job_end_year2);
                            datecount += 1;
                        }
                        if (PROFILE.employer3 != "") {
                            pollDOM('//*[@aria-label="Add Another Work Experience"]', function() {
                                document.querySelector('[aria-label="Add Another Work Experience"]').click()
                                pollDOM('(//*[@data-automation-id="jobTitle"])[3]', function() {
                                    trytypelist('//*[@data-automation-id="jobTitle"]', 2, PROFILE.job_title3);
                                    trytypelist('//*[@data-automation-id="company"]', 2, PROFILE.employer3);
                                    trytypelist('//*[@data-automation-id="location"]', 2, PROFILE.job_location3);
                                    trytypelist('//*[@data-automation-id="description"]', 2, PROFILE.job_desc3);
                                    trytypelist('//*[@data-automation-id="dateInputWrapper"]', datecount, PROFILE.job_start_month3 + PROFILE.job_start_year3);
                                    datecount += 1;
                                    if (PROFILE.current_job2 == 1) {
                                        document.evaluate('//*[@data-automation-id="currentlyWorkHere"]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(2).click();
                                    } else {
                                        trytypelist('//*[@data-automation-id="dateInputWrapper"]', datecount, PROFILE.job_end_month3 + PROFILE.job_end_year3);
                                        datecount += 1;
                                        }
                                    });
                                });
                            }
                        });
                    });
                }
                if (currenttext.includes("Degree") || existsquery('[aria-label=Add Education]')) {
                    edusection = true;
                    if (currenttext.includes("Degree") == false) {
                        document.querySelector("[aria-label='Add Education']").click();
                        pollDOM("//*[@data-automation-id='school']", function() {
                            changevalue(document.querySelector("[data-automation-id='school']"), PROFILE.university);
                            changevalue(document.querySelector("[data-automation-id='gpa']"), PROFILE.gpa);
                            trytypelist('//*[@data-automation-id="educationSection"]//*[@data-automation-id="dateInputWrapper"]', 0, PROFILE.uni_start_year);
                            trytypelist('//*[@data-automation-id="educationSection"]//*[@data-automation-id="dateInputWrapper"]', 1, PROFILE.grad_year);
                            document.querySelector("[data-automation-id='degree']").click();
                            setTimeout(document.evaluate('//div[contains(text(), "Bachelors Degree")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click(), 800);
                            setTimeout(function() {
                                document.querySelector('[data-automation-id="multiselectInputContainer"]').click();
                                setTimeout(function() {
                                    var major = '[data-automation-label="' + PROFILE.major + '"]';
                                    changevalue(document.querySelector('[data-automation-id="searchBox"]'), PROFILE.major);
                                    setTimeout(document.querySelector(major).click(), 600);
                                    }, 600)
                                }, 1000)
                            })
                        }
                    }
                if (existsquery('[aria-label="Add Languages"]') || currenttext.includes('native language')) {
                    langsection = true;
                    // language ttff 
                    if (currenttext.includes("native language") == false) {
                        document.querySelector("[aria-label='Add Languages']").click();
                        setTimeout(function() {
                            document.querySelector("[data-automation-id='language']").click();
                            setTimeout(document.evaluate('//div[contains(text(), "English")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click(), 500);
                            }, 1000);
                        setTimeout(function() {
                            document.querySelector("[data-automation-id='languageProficiency-0']").click();
                            setTimeout(document.evaluate('//div[contains(text(), "Native")]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click(), 1500);
                        }, 2000);
                        setTimeout(document.querySelector('[data-automation-id="nativeLanguage"]').click(), 2300);
                    }
            //upload resume here
            //click code goes here
                }
            //trytypelist
            }
        pollDOM('//*[@data-automation-id="jobTitle"]', defaultfunc())
        }
    }
    if (form == "custom") {
        if (currenttext.includes("Job Title") == false) {
            document.evaluate('//*[contains(text(), "Work Experience")]//following::button[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click();
        }
        function custom() {
            trytypexpath('//*[contains(text(), "Job Title")]//following::input[1]', PROFILE.job_title1);
            trytypexpath('//*[contains(text(), "Company")]//following::input[1]', PROFILE.employer1);
            trytypexpath('//*[contains(text(), "Location")]//following::input[1]', PROFILE.job_location1);
            trytypexpath('//*[contains(text(), "Role Description")]//following::input[1]', PROFILE.job_desc1);
            trytypexpath('//*[contains(text(), "Work Experience")]//following::*[@data-automation-id="dateWidgetInputBox"]', PROFILE.job_start_month1 + PROFILE.job_start_year1);
            if (PROFILE.current_job1 == 1) {
                document.evaluate('(//label[contains(text(), "currently work here")])[1]//following::input[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click();
            } else {
                trytypelist('//*[contains(text(), "Work Experience")]//following::*[@data-automation-id="dateWidgetInputBox"]', datecount, PROFILE.job_end_month1 + PROFILE.job_end_year1);
                datecount += 1
            }
            if (PROFILE.employer2 != "") {
                setTimeout(function() {
                    document.evaluate('//*[contains(text(), "Work Experience")]//following::button[2]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click();
                    setTimeout(function() {
                        trytypexpath('(//*[contains(text(), "Job Title")])[3]//following::input[1]', PROFILE.job_title2);
                        trytypexpath('(//*[contains(text(), "Company")])[3]//following::input[1]', PROFILE.employer2);
                        trytypexpath('(//*[contains(text(), "Location")])[3]//following::input[1]', PROFILE.job_location2);
                        trytypexpath('(//*[contains(text(), "Role Description")])[3]//following::input[1]', PROFILE.job_desc2);
                        trytypelist('//*[contains(text(), "Work Experience")]//following::*[@data-automation-id="dateWidgetInputBox"]', datecount, PROFILE.job_start_month2 + PROFILE.job_start_year2);
                        datecount += 1;
                        if (PROFILE.current_job2 == 1) {
                            document.evaluate('(//label[contains(text(), "currently work here")])[2]//following::input[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click();
                        } else {
                            trytypelist('//*[contains(text(), "Work Experience")]//following::*[@data-automation-id="dateWidgetInputBox"]', datecount, PROFILE.job_end_month2 + PROFILE.job_end_year2);
                            datecount += 1;
                        }
                        setTimeout(function() {
                            trytypexpath('(//*[contains(text(), "Job Title")])[last()]//following::input[1]', PROFILE.job_title3);
                            trytypexpath('(//*[contains(text(), "Company")])[last()]//following::input[1]', PROFILE.employer3);
                            trytypexpath('(//*[contains(text(), "Location")])[last()]//following::input[1]', PROFILE.job_location3);
                            trytypexpath('(//*[contains(text(), "Role Description")])[last()]//following::input[1]', PROFILE.job_desc3);
                            trytypelist('//*[contains(text(), "Work Experience")]//following::*[@data-automation-id="dateWidgetInputBox"]', datecount, PROFILE.job_start_month3 + PROFILE.job_start_year3);
                            datecount += 1;
                            if (PROFILE.current_job2 == 1) {
                                document.evaluate('(//label[contains(text(), "currently work here")])[3]//following::input[1]', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null).snapshotItem(0).click();
                            } else {
                                trytypelist('//*[contains(text(), "Work Experience")]//following::*[@data-automation-id="dateWidgetInputBox"]', datecount, PROFILE.job_end_month3 + PROFILE.job_end_year3);
                                datecount += 1;
                            }
                        }, 500)
                    }, 500)

                }, 500);
            }
        //education + language stuff





        }

    }
}

function initWorkday() {
    moveclick('button[title="Apply"]');
    var currenttext = document.getElementsByTagName("body")[0].innerText;
    var lowertext = currenttext.toLowerCase();
    if (lowertext.includes('sign in')) {
        login();
        if (existsquery('[data-automation-id="taskOrchCurrentItemLabel"]')) {
            return workday("we51", "none");
        }
        if (existsclass('css-1uso8fp')) {
            return workday("progressbar", "none");
        } else if (existstag('h2')) {
            return workday("h2", "none");
        }
        console.log("you're a fucking idiot learn how to fucking code michelle wouldd never");
    }
}
