
NUM_CHARS_IN_DATE = 10;

NUM_MATCHHISTORY_COL = 3
        
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
    
    var lis = '';

    // <li> tag is used in ordered lists (<ol>), unordered lists(<ul>), and in menu lists (<menu>)
    for(var i=0; i<list.length; i++)
    {
        lis += '<li data-key="' + list[i].key + '">' + list[i].playerA + '  ' + list[i].scoreA + " : " + list[i].scoreB + '  ' + list[i].playerB + ' ' + list[i].winner + ' </li>';
    };
    
    // sortList
    document.getElementById('matchHistoryList').innerHTML = lis;
    

    var myTableDiv = GetElementById('matchHistoryList_Table');  
    myTableDiv.innerHTML = "";
    myTableDiv.setAttribute('class', 'playerRanking');

    var table = document.createElement('TABLE');
    table.border='0';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);


    var tr = document.createElement('TR');
    tr.setAttribute('class', 'playerRanking_tr');
    tableBody.appendChild(tr);


    matchHistoryDictionaryByDate = {};


    for(var i=0; i<myCurMatchHistoryList.length; i++)
    {
        var matchHistoryObject = myCurMatchHistoryList[i];

        printMatchHistory(matchHistoryObject);

        var date = matchHistoryObject.date;

        console.log(date);

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


    for (var key in matchHistoryDictionaryByDate)
    {
        var list = matchHistoryDictionaryByDate[key];

        for(var mh in list)
        {
            console.log(mh.winner);
        }
    }


/*
    for(var i=0; i<myCurMatchHistoryList.length; i++)
    {


        buildMatchHistoryHeaderRow(tableBody, matchHistoryObject);

        var tr = document.createElement('TR');
        tr.setAttribute('class', 'playerRanking_tr');
        tableBody.appendChild(tr);

        // cell 1
        var td = getOneCellForPlayerRankingTable();
        td.width = RANKING_COL_WIDTH;
        td.appendChild(document.createTextNode(i));
        tr.appendChild(td);

        // cell 1
        var td = getOneCellForPlayerRankingTable();
        td.width = RANKING_COL_WIDTH;
        if(i %2 == 0)
        {
            td.style.color = "#00ff00";
            td.appendChild(document.createTextNode('^'));
        }
        else if (i%3 == 0)
        {
            td.appendChild(document.createTextNode(''));
        }
        else
        {
            td.style.color = "#ff0000";
            td.appendChild(document.createTextNode('v'));            
        }

        tr.appendChild(td);

        // cell 2
        var td = getOneCellForPlayerRankingTable();
        td.width = NAME_COL_WIDTH;
        td.appendChild(document.createTextNode(myCurPlayerList[i].name));
        tr.appendChild(td);

        // cell 3
        var td = getOneCellForPlayerRankingTable();
        td.width = RATING_COL_WIDTH;
        td.appendChild(document.createTextNode( parseInt(myCurPlayerList[i].eloRating)));
        tr.appendChild(td);

        td = buildEditAndDelLinksCell(playerObject);

        tr.appendChild(td);

    }

    myTableDiv.appendChild(table);
    console.log("things are here");
    */
}



// folling alligulac 
//  #   trend   Name        Rating      hyperlink
function buildMatchHistoryHeaderRow(tableBody, matchHistoryObject)
{
    var tr = document.createElement('TR');
    tr.setAttribute('class', 'playerRanking_th');
    tableBody.appendChild(tr);

    var td = getOneCellForPlayerRankingTable();
    td.setAttribute('colspan', NUM_MATCHHISTORY_COL);
    td.appendChild(document.createTextNode(matchHistoryObject.date));
    tr.appendChild(td);
}
