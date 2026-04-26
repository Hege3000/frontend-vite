*** Settings ***
Library    Browser

*** Variables ***
${URL}    https://www.selenium.dev/selenium/web/web-form.html

*** Test Cases ***
Web Form Test
    New Browser    chromium    headless=False
    New Page       ${URL}

    # Dropdown (select)
    Select Options By    id=my-select    value    1

    # Datalist
    Fill Text    id=my-datalist    Seattle

    # File input
    # Upload File    id=my-file    ${CURDIR}/testfile.txt

    # Checkboxit
    Check Checkbox    id=my-check-1
    Uncheck Checkbox  id=my-check-2

    # Radio buttonit
    Check Checkbox    id=my-radio-1

    Take Screenshot
    [Teardown]    Close Browser