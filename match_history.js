
NUM_CHARS_IN_DATE = 10;

NUM_MATCHHISTORY_COL = 5
        
MATCH_HISTORY_SCORE_COL_WIDTH = 200;

PLAYER_NAME_COL_WIDTH = 400;

SCORE_COL_WIDTH = 60;
SCORE_MIDDLE_DASH_COL_WIDTH = 3;


tempDateTime = 0;

function addTodaysDate()
{
    console.log("add Today's Date");
    var d = new Date();

    var nmhDate = document.getElementById('newMatchResultDate');

    var month = d.getMonth() + 1;

    if(month < 10)
    {
        nmhDate.value =  d.getFullYear() + '/0' + (d.getMonth()+1) + '/' + d.getDate();
    }
    else
    {
        nmhDate.value =  d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate();
    }

    tempDateTime = d.getTime();
}


function isValidSingleDigitNumber(numChar)
{
    var num = parseInt(numChar);
    if(num != NaN)
    {
        if( 0 <= num && num <= 9)
        {
            return true;
        }            
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
}


function isValidNumber(numberString)
{
    if(numberString.length < 0)
    {
        return false;
    }


    for(var i=0; i<numberString.length; i++)
    {
        var char = numberString[i];

        if( isValidSingleDigitNumber(char) == false)
        {
            return false;
        }

        if(i==0)
        {
            if(char == 0)
            {
                return false;
            }
        }
    }
    return true;
}

function isValidDateString(dateString)
{
    console.log("Here");

    console.log("dateString.length " + dateString.length);


    if(dateString.length != NUM_CHARS_IN_DATE)
    {
        return false;
    }

    for(var i=0; i<4; i++)
    {
        if( isValidSingleDigitNumber(dateString[i]) == false)
        {
            return false;
        }
    }

    if(dateString[4] != '/')
    {
        return false;
    }


    for(var i=5; i<7; i++)
    {
        if( isValidSingleDigitNumber(dateString[i]) == false)
        {
            return false;
        }
    }

    if(dateString[7] != '/')
    {
        return false;
    }


    for(var i=8; i<10; i++)
    {
        if( isValidSingleDigitNumber(dateString[i]) == false)
        {
            return false;
        }
    }
    return true;
}


function addNewMatchResult()
{
    valid = true;
    var nmhDate = document.getElementById('newMatchResultDate');
    var nmhPlayerA = document.getElementById('newMatchPlayerA');
    var nmhScoreA = document.getElementById('newMatchScoreA');
    var nmhPlayerB = document.getElementById('newMatchPlayerB');
    var nmhScoreB = document.getElementById('newMatchScoreB');
    var nmhWinner = document.getElementById('newMatchWinner');

    var date = nmhDate.value.trim();
    var playerA = nmhPlayerA.value.trim();
    var scoreA = nmhScoreA.value.trim();
    var playerB = nmhPlayerB.value.trim();
    var scoreB = nmhScoreB.value.trim();
    var winner = nmhWinner.value.trim();
        
    var tempList = [];
    tempList.push(playerA);
    tempList.push(playerB);



    var errorMsg = "";

    if(valid == true)
    {
        if(isValidDateString(date) == false)
        {
            errorMsg = "invalid date format, use (YYYY/MM/DD)";
            valid = false;
        }
    }

    if(valid == true)
    {
        if(playerA == playerB)
        {
            errorMsg = "can't have the same players against each other";
            valid = false;
        }
    }

    if(valid == true)
    {
        if(isValidNumber(scoreA) == false)
        {
            errorMsg = "scoreA is invalid";
            valid = false;
        }
    }

    if(valid == true)
    {   
        if(scoreA == scoreB)
        {
            errorMsg = "scoreA == scoreB, that shouldn't happne";
            valid = false;
        }
    }

    if(valid == true)
    {
        if(isValidNumber(scoreB) == false)
        {
            errorMsg = "scoreB is invalid";
            valid = false;
        }
    }


    // check if playerA and playerB exists
    if(valid == true)
    {
        var undefinedPlayerList = checkPlayersInList(tempList);
        console.log("undefinedPlayerList.length " + undefinedPlayerList.length);
        if(undefinedPlayerList.length > 0)
        {
            var str = "";

            i=0;
            for(i=0; i<undefinedPlayerList.length; i++)
            {
                var p = undefinedPlayerList[i];
                if(i==0)
                {
                    str += p;
                }
                else
                {
                    str += ", " + p;
                }
            }

            valid = false;
            errorMsg = "couldn't find player '" + str + "'' in our database";
        }
    }

    if(valid == true) 
    {
        if(winner != playerA && winner != playerB)
        {
            errorMsg = "invalid winnder";    
            valid = false;
        }
    }

    if(valid == true)
    {
        if(winner == playerA)
        {
            if(scoreA < scoreB)
            {
                errorMsg = "the winner has the lower score?";    
                valid = false;
            }
        }
        else
        {
            if(scoreB < scoreA)
            {
                errorMsg = "the winner has the lower score?";    
                valid = false;
            }       
        }
    }

    // check the numbers of valid
    // check if date is valid


    if(valid == true)
    {
        saveMatchHistoryToFirebase(date, playerA, scoreA, playerB, scoreB, winner);   
        nmhDate.value = '';
        nmhPlayerA.value = '';
        nmhScoreA.value = '';
        nmhPlayerB.value = '';
        nmhScoreB.value = '';
        nmhWinner.value = '';     
    }
    else
    {
        console.log("Not saving to db, invalid");
    }


    if(valid == true)
    {
        errorMsg = "<span style=\"color:green\">" + " added " + "</span>";
        var label = document.getElementById('errorMessageLabel').innerHTML = errorMsg;

        playerAObject = findPlayerObject(playerA);
        playerBObject = findPlayerObject(playerB);

        console.log(playerAObject);
        console.log(playerBObject);

        var winnerIsA = false;
        if(winner == playerA)
        {
            winnerIsA = true;
        }

        updateELO(playerAObject, playerBObject, winnerIsA);
    }
    else
    {
        errorMsg = "<span style=\"color:red\">" + errorMsg + "</span>";
        var label = document.getElementById('errorMessageLabel').innerHTML = errorMsg;
    }


}


function printMatchHistory(matchHistoryObject)
{
    console.log(matchHistoryObject.date + " " + matchHistoryObject.playerA + " " + matchHistoryObject.scoreA + " " + matchHistoryObject.scoreB + " " + matchHistoryObject.playerB + " " + matchHistoryObject.winner);
}

function refreshMatchHistoryUI(list)
{
    var myTableDiv = GetElementById('matchHistoryList_Table');  
    myTableDiv.innerHTML = "";
    myTableDiv.setAttribute('class', 'matchHistoryTable');

    var table = document.createElement('TABLE');
    table.border='0';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);


    var tr = document.createElement('TR');
    tableBody.appendChild(tr);


    matchHistoryDictionaryByDate = {};


    for(var i=0; i<myCurMatchHistoryList.length; i++)
    {
        var matchHistoryObject = myCurMatchHistoryList[i];

        printMatchHistory(matchHistoryObject);

        var date = matchHistoryObject.date;

        if(date in matchHistoryDictionaryByDate)
        {
            matchHistoryDictionaryByDate[date].push(matchHistoryObject);
        }
        else
        {
            matchHistoryDictionaryByDate[date] = [];
            matchHistoryDictionaryByDate[date].push(matchHistoryObject);
        }
    }   

    console.log(matchHistoryDictionaryByDate);


    for (var key in matchHistoryDictionaryByDate)
    {
        var list = matchHistoryDictionaryByDate[key];
        console.log(list.length);
        for(var i=0; i<list.length; i++)
        {
            printMatchHistory(list[i]);
        }
    }


    listSortedByDate = []
    for (var key in matchHistoryDictionaryByDate)
    {
        listSortedByDate.push([key, matchHistoryDictionaryByDate[key]]);
    }

    listSortedByDate.sort(function(a, b)
    {
        console.log(a);
        console.log(b);

        var dateA = new Date(a[0]);
        var dateB = new Date(b[0]);
     
        var yearDiff = dateB.getFullYear() - dateA.getFullYear();
        if(yearDiff !=0 )
        {
            return yearDiff;
        }  

        var monthDiff = dateB.getMonth() - dateA.getMonth();
        if(monthDiff != 0 )
        {
            return monthDiff;
        }

        var dayDiff = dateB.getDate() - dateA.getDate();
        if(dayDiff != 0)
        {
            return dayDiff;
        }

        return 1;

    })



    for(var i=0; i<listSortedByDate.length; i++)
    {
        var date = listSortedByDate[i][0];
        buildDateHeaderRow(tableBody, date);

        var subList = listSortedByDate[i][1];


        for(var j=0; j<subList.length; j++)
        {
            buildRowForMatchHistory(tableBody, subList[j])
        }
    }

    myTableDiv.appendChild(table);    
}




// folling alligulac 
//  #   trend   Name        Rating      hyperlink
function buildDateHeaderRow(tableBody, date)
{
    var tr = document.createElement('TR');

    var th = document.createElement('th');
    th.setAttribute('class', 'matchHistoryTable_th');
    th.setAttribute('colspan', NUM_MATCHHISTORY_COL);
    
    th.appendChild(document.createTextNode(date));
    tr.appendChild(th);
    tableBody.appendChild(tr);
}


function buildRowForMatchHistory(tableBody, matchHistoryObject)
{

    var tr = document.createElement('TR');
    tableBody.appendChild(tr);

    AIsWinner = matchHistoryObject.playerA == matchHistoryObject.winner;

    var td = getOneCellForLeftPlayer(matchHistoryObject.playerA, AIsWinner);
    td.width = PLAYER_NAME_COL_WIDTH;
    tr.appendChild(td);

    var td = getOneCellForLeftScore(matchHistoryObject.scoreA);
    td.width = SCORE_COL_WIDTH;
    tr.appendChild(td);

    var td = getOneCellForMiddleDash();
    td.width = SCORE_MIDDLE_DASH_COL_WIDTH;
    tr.appendChild(td);

    var td = getOneCellForRightScore(matchHistoryObject.scoreB);
    td.width = SCORE_COL_WIDTH;
    tr.appendChild(td);


    var td = getOneCellForRightPlayer(matchHistoryObject.playerB, AIsWinner == false);
    td.width = PLAYER_NAME_COL_WIDTH;
    tr.appendChild(td);
}


function getOneCellForLeftPlayer(name, isWinner)
{
    var td = document.createElement('TD');
    td.appendChild(document.createTextNode(name));
    if(isWinner)
    {
        td.setAttribute('class', 'matchHistoryTableLeftWinner_td');
    }
    else
    {
        td.setAttribute('class', 'matchHistoryTableLeftLoser_td');
    }
    return td;
}

function getOneCellForLeftScore(score)
{
    var td = document.createElement('TD');
    td.setAttribute('class', 'matchHistoryTableLeftScore_td');
    td.appendChild(document.createTextNode(score));
    return td;
}

function getOneCellForMiddleDash()
{
    var td = document.createElement('TD');
    td.setAttribute('class', 'matchHistoryTableMiddleDash_td');
    td.appendChild(document.createTextNode("-"));
    return td;
}

function getOneCellForRightScore(score)
{
    var td = document.createElement('TD');
    td.setAttribute('class', 'matchHistoryTableRightScore_td');
    td.appendChild(document.createTextNode(score));
    return td;
}


function getOneCellForRightPlayer(name, isWinner)
{
    var td = document.createElement('TD');
    td.setAttribute('class', 'matchHistoryTableRight_td');
    td.appendChild(document.createTextNode(name));
    if(isWinner)
    {
        td.setAttribute('class', 'matchHistoryTableRightWinner_td');
    }
    else
    {
        td.setAttribute('class', 'matchHistoryTableRightLoser_td');
    }
    return td;
}
