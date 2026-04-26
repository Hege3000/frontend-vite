*** Settings ***
Library    RequestsLibrary
Library    Collections

Suite Setup    Create Session    api    http://localhost:3000

*** Test Cases ***
Get API Root
    ${response}=    GET On Session    api    /api
    Status Should Be    200    ${response}

Login Test
    ${body}=    Create Dictionary    username=hege3001    password=hege3001
    ${response}=    POST On Session    api    /api/users/login    json=${body}
    Status Should Be    200    ${response}
    Dictionary Should Contain Key    ${response.json()}    token

Get Entries
    ${body}=    Create Dictionary    username=hege3001    password=hege3001
    ${login}=    POST On Session    api    /api/users/login    json=${body}
    ${token}=    Set Variable    ${login.json()}[token]
    ${headers}=    Create Dictionary    Authorization=Bearer ${token}
    ${response}=    GET On Session    api    /api/entries    headers=${headers}
    Status Should Be    200    ${response}