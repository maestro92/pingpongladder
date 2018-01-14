
// test cases: duplicate users
// edit user name, has to change all occurences in match history as well



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
    var playerNodeRef = bhgPingPongLadderDB.child("matches");
    playerNodeRef.set({
        date: date,
        playerA: playerNameA,
        scoreA: scoreA,
        playerB: playerNameB,
        scoreB: scoreB,
        winner: winner
    });
}


function refreshPlayerUI(list)
{
    var lis = '';

    // <li> tag is used in ordered lists (<ol>), unordered lists(<ul>), and in menu lists (<menu>)
    for(var i=0; i<list.length; i++)
    {
        lis += '<li data-key="' + list[i].key + '">' + list[i].name + '     ' + list[i].eloRating +' [' + genLinks(list[i].key, list[i].name) + ']</li>';
    //    lis += list[i].name + '     ' + list[i].eloRating +' [' + genLinks(list[i].key, list[i].name) + ']</li>';
    
    };

    // sortList

    document.getElementById('currentPlayerList').innerHTML = lis;
}


function getTrimmedPlayerName(rawString)
{
    return name.trim();
}

// TODO: optimizing here
function checkPlayersInList(playerNameList)
{
    console.log("in here1");
    var flags = [];
    for (var player in playerNameList)
    {
        flags.push(0);
    }
    
    console.log("in here2");

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

                console.log("name " + name);


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

    if(playerA == playerB)
    {
        console.log("can't have the same players against each other");
        valid = false;
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
            console.log("couldn't find player '" + str + "'' in our database");
        }
    }

    if(valid == true) 
    {
        if(nmhWinner != playerA && nmhWinner != playerB)
        {
            console.log("invalid winnder");    
            valid = false;
        }
    }

    // check the numbers of valid
    // check if date is valid


    if(valid == true)
    {
        saveMatchHistoryToFirebase(nmhDate, nmhPlayerA, nmhScoreA, nmhPlayerB, nmhScoreB, nmhWinner);        
    }
    else
    {
        console.log("Not saving to db, invalid");
    }



    nmhDate.value = '';
    nmhPlayerA.value = '';
    nmhScoreA.value = '';
    nmhPlayerB.value = '';
    nmhScoreB.value = '';
    nmhWinner.value = '';
}


function addTodaysDate()
{
    console.log("add Today's Date");
}


function refreshMatchHistoryUI(list)
{
    var lis = '';

    // <li> tag is used in ordered lists (<ol>), unordered lists(<ul>), and in menu lists (<menu>)
    for(var i=0; i<list.length; i++)
    {
        lis += '<li data-key="' + list[i].key + '">' + list[i].playerA + '  ' + list[i].scoreA + " : " + list[i].scoreB + '  ' + list[i].playerB + ' ' + matchWinner + ' </li>';
    };

    // sortList
    document.getElementById('matchHistoryList').innerHTML = lis;
}


function updateELO(matchHistory)
{

}

