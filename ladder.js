
// test cases: duplicate users
// edit user name, has to change all occurences in match history as well

myCurPlayerList = [];
myCurMatchHistoryList = [];

RANKING_COL_WIDTH = 50;
NAME_COL_WIDTH = 175;
RATING_COL_WIDTH = 175;


INDEX_TO_COL_HEADER_MAPPING = ["#", "", "Name", "Rating", ""];


// tabs
// https://www.w3schools.com/howto/howto_js_tabs.asp

function openRankingPage(evt, pageNameId)
{
    ResetPagesUI();

    // display an element as a block element (like <p>). It starts on a new line,
    // and takes up the whole width
    // https://www.w3schools.com/cssref/pr_class_display.asp
    document.getElementById(pageNameId).style.display = "inline-block";
    evt.currentTarget.className += " active";
}


function openHistoryPage(evt, pageNameId)
{
    ResetPagesUI();
    document.getElementById(pageNameId).style.display = "inline-block";
    evt.currentTarget.className += " active";
}

function ResetPagesUI()
{
    var i;

    // https://www.w3schools.com/jsref/prop_style_display.asp
    // Set a <div> element to not be displayed
    var tabcontent = document.getElementsByClassName("tabcontent");
    for(i = 0; i < tabcontent.length; i++)
    {
        tabcontent[i].style.display = "none";
    }

    // clear highlight on tab buttons
    // here className.replace refers to setting and removing a CSS class name for a HTML element
    // see the link below for more info
    // http://onetarek.com/javascript-and-jquery/how-to-add-or-remove-a-class-using-raw-javascript-and-jquery/

    var tablinks = document.getElementsByClassName("tablinks");
    for(i = 0; i < tablinks.length; i++)
    {
        // apparently, I must keep a space before class name
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}


function isValidPlayerName()
{

}


function addNewPlayer()
{                     
    console.log("adding New User");
    var newPlayerNameField = document.getElementById('newPlayerNameInput');

    var playerName = newPlayerNameField.value.trim();
    var staringELO = 1000;

    if(playerName.length > 0)
    {
        savePlayerToFirebase(playerName, staringELO);        
    }


    newPlayerNameField.value = '';
}

// Saving Data to Firebase
// https://firebase.google.com/docs/database/admin/save-data
// this argument we passed into the push() function is essentially a JSON object

// https://stackoverflow.com/questions/42885707/using-push-method-to-create-new-child-location-without-unique-key
function savePlayerToFirebase(playerName, elo)
{
    playerDBref.push({
        name: playerName,
        eloRating:elo
    });
}


function saveMatchHistoryToFirebase(date, playerNameA, scoreA, playerNameB, scoreB, winner)
{
//    var playerNodeRef = bhgPingPongLadderDB.child("matches");
//    playerNodeRef.set({
    playerMatchesDBref.push(
    {
        date: date,
        playerA: playerNameA,
        scoreA: scoreA,
        playerB: playerNameB,
        scoreB: scoreB,
        winner: winner
    }, 

    function(error)
    {
        if(error)
        {
            alert("Data could not be saved." + error);
        }
        else
        {
            alert("Data saved successfully.");
        }
    }
    );
}


function GetElementById(id)
{
    var myTableDiv = document.getElementById(id);
    return myTableDiv;

    $(document).ready(function(){

    });
//        var myTableDiv = $('#currentPlayerList_Table')[0];  
}


function refreshPlayerUI(list)
{
    // sortList
    list.sort(function(a, b)
    {
        return b.eloRating - a.eloRating;
    })

    /*
    // <li> tag is used in ordered lists (<ol>), unordered lists(<ul>), and in menu lists (<menu>)
    for(var i=0; i<list.length; i++)
    {
        lis += '<li data-key="' + list[i].key + '">' + list[i].name + '     ' + parseInt(list[i].eloRating) +' [' + genLinks(list[i].key, list[i].name) + ']</li>';
    };
    document.getElementById('currentPlayerList').innerHTML = lis;
    */

    // https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Traversing_an_HTML_table_with_JavaScript_and_DOM_Interfaces
    // var myTableDiv = document.getElementById("currentPlayerList_Table");
    // $('#contents')  returns a jQuery Object
    var myTableDiv = GetElementById('currentPlayerList_Table');  
    myTableDiv.innerHTML = "";

    myTableDiv.setAttribute('class', 'playerRankingTable');

    var table = document.createElement('TABLE');
    table.border='0';

    var tableBody = document.createElement('TBODY');
    table.appendChild(tableBody);


    var tr = document.createElement('TR');
    tr.setAttribute('class', 'playerRanking_tr');
    tableBody.appendChild(tr);

    buildPlayerRankingHeaderRow(tableBody);


    for(var i=0; i<list.length; i++)
    {
        var playerObject = list[i];

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
        td.appendChild(document.createTextNode(list[i].name));
        tr.appendChild(td);

        // cell 3
        var td = getOneCellForPlayerRankingTable();
        td.width = RATING_COL_WIDTH;
        td.appendChild(document.createTextNode( parseInt(list[i].eloRating)));
        tr.appendChild(td);

        td = buildEditAndDelLinksCell(playerObject);

        tr.appendChild(td);

    }

    myTableDiv.appendChild(table);
    console.log("things are here");
}


// folling alligulac 
//  #   trend   Name        Rating      hyperlink
function buildPlayerRankingHeaderRow(tableBody)
{
    var tr = document.createElement('TR');
    tr.setAttribute('class', 'playerRanking_th');
    tableBody.appendChild(tr);

    for (var i=0; i<5; i++)
    {
        var td = getOneCellForPlayerRankingTable();
        td.width = RANKING_COL_WIDTH;
        td.appendChild(document.createTextNode(INDEX_TO_COL_HEADER_MAPPING[i]));
        tr.appendChild(td);
    }
}


function getOneCellForPlayerRankingTable()
{
    var td = document.createElement('TD');
    td.setAttribute('class', 'playerRanking_td');
    return td;
}

function buildEditAndDelLinksCell(playerObject)
{
    // cell 4
    var td = document.createElement('TD');
    td.setAttribute('class', 'playerRanking_td');
    td.width = RATING_COL_WIDTH;
   
    // create link using javascript
    // https://stackoverflow.com/questions/4772774/how-do-i-create-a-link-using-javascript

    var spacer = document.createElement('a');
    var spacerNode = document.createTextNode("[ ");
    td.appendChild(spacerNode);


    var editNode = document.createElement('a');
    var linkText = document.createTextNode("Edit");
    editNode.appendChild(linkText);
    editNode.title = "Edit";
    editNode.href = "javascript:edit(\'' + 'playerObject.key' + '\',\'' + 'playerObject.playerName' + '\')";
    td.appendChild(editNode);

    spacer = document.createElement('a');
    spacerNode = document.createTextNode(" | ");
    td.appendChild(spacerNode);


    var delNode = document.createElement('a');
    linkText = document.createTextNode('Delete');
    delNode.appendChild(linkText);
    delNode.title = "Delete";
    delNode.href = 'javascript:del(\'' + playerObject.key + '\',\'' + playerObject.name + '\')';
    td.appendChild(delNode);

    spacer = document.createElement('a');
    spacerNode = document.createTextNode(" ]");
    td.appendChild(spacerNode);
    return td;
}


function getTrimmedPlayerName(rawString)
{
    return name.trim();
}


function findPlayerObject(playerName)
{
    for(i = 0; i< myCurPlayerList.length; i++)
    {
        var player = myCurPlayerList[i];

        if(player.name == playerName)
        {
            return player;
        }
    }
    return null;
}

// TODO: optimizing here
function checkPlayersInList(playerNameList)
{
    var flags = [];
    for (var player in playerNameList)
    {
        flags.push(0);
    }
    

    playerDBref.once("value", function (snapshot) {
        var data = snapshot.val();
        console.log(snapshot.val());
        var message = data.text;
        if (message != undefined)
        {
            messageResults.value += '\n' + message;
        }

        var list = [];
        for (var key in data)
        {
            if(data.hasOwnProperty(key))
            {                        
                var playerData = data[key];

                var name = playerData.name;

                for(i=0; i<playerNameList.length; i++)
                {
                    var p = playerNameList[i];
                    console.log("   p " + p);

                    if(p == name)
                    {
                        console.log("           name is the same");
                        flags[i] = 1;
                    }
                }

                var allFound = true;
                for(i=0; i<flags.length; i++)
                {
                    if(flags[i] == 0)
                    {
                        allFound = false;
                        break;
                    }
                }
                if(allFound == true)
                {
                    break;
                }
            }
        }

    });

    console.log("in here3");
    var returnedPlayerList = [];
    for(i=0; i<playerNameList.length; i++)
    {
        console.log(flags[i]);
        if(flags[i] == 0)
        {
            returnedPlayerList.push(playerNameList[i]);
        }
    }
            console.log("returning " + returnedPlayerList);
                console.log("returning " + returnedPlayerList.length);
    return returnedPlayerList;
}


/*
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

    buildPlayerRankingHeaderRow(tableBody);


    for(var i=0; i<myCurPlayerList.length; i++)
    {
        var playerObject = myCurPlayerList[i];

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
}
*/


// https://gamedev.stackexchange.com/questions/55441/player-ranking-using-elo-with-more-than-two-players
function updateELO(playerA, playerB, winnerIsA)
{
    var ra = playerA.eloRating;
    var rb = playerB.eloRating;

    expectedScoreA = 1 / (1 + 10^(rb - ra)/400);
    expectedScoreB = 1 / (1 + 10^(ra - rb)/400);

    if(winnerIsA)
    {
        playerA.eloRating = ra + 32 * (1 - expectedScoreA);
        playerB.eloRating = rb + 32 * (0 - expectedScoreB);
    }
    else
    {
        playerA.eloRating = ra + 32 * (0 - expectedScoreA);
        playerB.eloRating = rb + 32 * (1 - expectedScoreB);
    }

    console.log(playerA.eloRating + " " + playerB.eloRating);

    playerDBref.child(playerA.key).update(
        {eloRating: playerA.eloRating}
    );

    playerDBref.child(playerB.key).update(
        {eloRating: playerB.eloRating}
    );
}


// http://www.mysamplecode.com/2012/04/generate-html-table-using-javascript.html
function showFullPlayerListPage()
{
    console.log("Show full player List page");
}
