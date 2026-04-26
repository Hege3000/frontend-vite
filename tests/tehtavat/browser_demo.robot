*** Settings ***
Library     Browser    auto_closing_level=KEEP
Resource    Keywords.robot  

*** Test Cases ***
Test Web Form
    New Browser    chromium    headless=No  
    New Page       http://localhost:5173/login.html
    Get Title      ==   Miten menee? - Kirjaudu 
    Type Text      id=loginUsername        ${Username}    delay=0.1 s 
    Type Secret    id=loginPassword    $Password      delay=0.1 s
    
    Click With Options    .loginForm >> button   delay=2 s
    Get Text       id=loginMessage    *=    Kirjautuminen onnistui