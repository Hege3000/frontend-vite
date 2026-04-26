*** Settings ***
Library     Browser    auto_closing_level=KEEP
Library     CryptoLibrary    variable_decryption=True

*** Variables ***
${USERNAME}    crypt:YNX4Mp6LJy3mI4GNeA4H5CrLwtMdqGBcdtXu8YguXlI58auP2FWbS8Q54blFdNktxWHtZ4qmCuk=
${PASSWORD}    crypt:/0LrQuuStU9fJyJFX7wd8gUKZcvp+uRMrX6kPkxFtA+5ekoy4GUYHMx5nraBt64n+j2P06XO+yQ=
${URL}         http://localhost:5173

*** Test Cases ***
Crypto Login Test
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