*** Settings ***
Library    Browser    auto_closing_level=KEEP
Variables    ../../load_env.py

*** Test Cases ***
Add New Entry Test
    New Browser    chromium    headless=No
    New Page       ${URL}/login.html
    Get Title      ==    Miten menee? - Kirjaudu
    Type Text      id=loginUsername    ${USERNAME}    delay=0.1 s
    Type Secret    id=loginPassword    $PASSWORD      delay=0.1 s
    Click With Options    form.loginForm >> button[type="submit"]    delay=2 s
    Sleep          3s
    Get Url        ==    ${URL}/paivakirja.html

    Click          button.add_entry_btn
    Fill Text      id=entry_date      2026-04-26    
    Type Text      id=mood            iloinen       delay=0.1 s
    Type Text      id=weight          70            delay=0.1 s
    Type Text      id=sleep_hours     8             delay=0.1 s
    Type Text      id=notes           Robotti testasi päiväkirjaa!    delay=0.1 s
    Click With Options    form.entryForm >> button[type="submit"]    delay=2 s
    Sleep          2s
    Get Text       id=entryMessage    ==    Merkintä lisätty!
    Take Screenshot
    Sleep          2s