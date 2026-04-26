*** Settings ***
Library     Browser    auto_closing_level=KEEP
Library     BuiltIn

*** Test Cases ***
Suorita Tehtava 3 Web Form
    # Avataan selain ja pidetään se auki
    New Browser    chromium    headless=No
    New Page       https://www.selenium.dev/selenium/web/web-form.html
    
    # 1. Dropdown (select)
    Select Options By    [name="my-select"]    value    2
    
    # 2. Dropdown (datalist)
    Type Text      [name="my-datalist"]    Helsinki
    
    # 3. Checkboxit
    Check Checkbox      id=my-check-1
    Check Checkbox      id=my-check-2
    
    # 4. Radio buttonit
    Click          id=my-radio-1
    
    # 5. File input 
    
    Upload File By Selector    [name="my-file"]    ${CURDIR}/testi.txt
    
    # Lähetys (Submit)
    Click          button[type="submit"]
    
    # Varmistetaan onnistuminen
    Get Text       h1    ==    Form submitted
    
    # Pysäytetään testi 10 sekunniksi kuvakaappausta varten
    Sleep          10s