*** Settings ***
Library      Browser    auto_closing_level=KEEP
Variables    ../../load_env.py

*** Test Cases ***
Successful Login Test
    New Browser    chromium    headless=No
    New Page       ${URL}/login.html
    Get Title      ==    Miten menee? - Kirjaudu
    Type Text      id=loginUsername    ${USERNAME}    delay=0.1 s
    Type Secret    id=loginPassword    $PASSWORD      delay=0.1 s
    Click With Options    form.loginForm >> button[type="submit"]    delay=2 s
    Sleep          3s
    Get Url        ==    ${URL}/paivakirja.html
    Take Screenshot
    Sleep          2s

Failed Login Test
    New Browser    chromium    headless=No
    New Page       ${URL}/login.html
    Type Text      id=loginUsername    vaariatunnus    delay=0.1 s
    Type Secret    id=loginPassword    $PASSWORD       delay=0.1 s
    Click With Options    form.loginForm >> button[type="submit"]    delay=2 s
    Get Url        ==    ${URL}/login.html
    Take Screenshot
    Sleep          2s