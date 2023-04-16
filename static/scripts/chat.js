// Collapsible
var coll = document.getElementsByClassName("collapsible");

var i = 0;

let isWaiting = false;

let loadingHTML = `<svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 45 60 10" enable-background="new 0 0 0 0" xml:space="preserve">
<circle fill="080808" stroke="none" cx="6" cy="50" r="6">
  <animate
    attributeName="opacity"
    dur="1s"
    values="0;1;0"
    repeatCount="indefinite"
    begin="0.1"/>    
</circle>
<circle fill="080808" stroke="none" cx="26" cy="50" r="6">
  <animate
    attributeName="opacity"
    dur="1s"
    values="0;1;0"
    repeatCount="indefinite" 
    begin="0.2"/>       
</circle>
<circle fill="080808" stroke="none" cx="46" cy="50" r="6">
  <animate
    attributeName="opacity"
    dur="1s"
    values="0;1;0"
    repeatCount="indefinite" 
    begin="0.3"/>     
</circle>
</svg>`;

for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");

        var content = this.nextElementSibling;

        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }

    });
}

function getTime() {
    let today = new Date();
    hours = today.getHours();
    minutes = today.getMinutes();

    if (hours < 10) {
        hours = "0" + hours;
    }

    if (minutes < 10) {
        minutes = "0" + minutes;
    }

    let time = hours + ":" + minutes;
    return time;
}

// Gets the first message
function firstBotMessage() {
    let firstMessage = "こんにちは、totonoüによって開発されたChatGPTをベースとしたチャットボットです。サウナに関する質問に対応するため、特別にチューニングをされています。ご質問やご要望があればお気軽にメッセージをしてくださいね。<br>※内容の正確性を補償するものではありません。あくまでも検討や利用の際の補助としてご活用ください"
    document.getElementById("botStarterMessage").innerHTML = '<p class="botText"><span>' + firstMessage + '</span></p>';

    let time = getTime();

    $("#chat-timestamp").append(time);
    document.getElementById("userInput").scrollIntoView(false);
}

firstBotMessage();

// Retrieves the response
async function getHardResponse(userText) {
    let botResponse = await getBotResponse(userText);
    let botHtml = '<p class="botText"><span>' + botResponse['answer'] + '</span></p>';
    $("#chatbox").append(botHtml);

    document.getElementById("chat-bar-bottom").scrollIntoView(true);
}

//Gets the text text from the input box and processes it
function getResponse() {
    
    isWaiting = true;

    let userText = $("#textInput").val();

    if (userText == "") {
        userText = "I love Code Palace!";
    }

    let userHtml = '<p class="userText"><span>' + userText + '</span></p>';

    $("#textInput").val("");
    $("#chatbox").append(userHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);

    i++;

    setTimeout(() => {
        var data = {
            prompt: userText
        };

        var botPromise = $.ajax({
            // url: "https://totonou-project-chatbot-gateway-407tq1ig.an.gateway.dev/",
            // url: "https://totonou-project-chatbot.an.r.appspot.com/",
            url: "https://totonou-sitegpt-3qznvkpr5a-an.a.run.app",
            // url: "http://127.0.0.1:8080/",
            headers: {
                'Content-Type': 'application/json',
            },
            type: 'POST',
            data: JSON.stringify(data),
            // dataType: 'json',
            xhrFields: {
                // Getting on progress streaming response
                onprogress: function(e)
                {
                    var response = e.currentTarget.response;
                    document.getElementById('answerTextSpan' + String(i)).textContent = response;
                    document.getElementById("chat-bar-bottom").scrollIntoView(true);
                }
            }
        });

        // Show loader until getting an initial streaming response.
        let emptyHtml = '<p id="answerText' + String(i) + '" class="botText"><span id="answerTextSpan' + String(i) + '">' + loadingHTML + '</span></p>';
        $("#chatbox").append(emptyHtml);
        document.getElementById("chat-bar-bottom").scrollIntoView(true);

        botPromise.then(function(res, textStatus, jqXHR) {
            isWaiting = false;
        }, function(jqXHR, textStatus, errorThrown) {
            console.log('Failed.');
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
            $("#answerText" + String(i)).remove();
            let botHtml = '<p class="botText"><span>申し訳ございません。サーバーが混み合っているため、時間をおいて再度お問い合わせください。</span></p>';
            $("#chatbox").append(botHtml);
            document.getElementById("chat-bar-bottom").scrollIntoView(true);
            isWaiting = false;
        });

    }, 1000);
}

// Handles sending text via button clicks
function buttonSendText(sampleText) {
    let userHtml = '<p class="userText"><span>' + sampleText + '</span></p>';

    $("#textInput").val("");
    $("#chatbox").append(userHtml);
    document.getElementById("chat-bar-bottom").scrollIntoView(true);

    //Uncomment this if you want the bot to respond to this buttonSendText event
    // setTimeout(() => {
    //     getHardResponse(sampleText);
    // }, 1000)
}

function sendButton() {
    if (isWaiting == false) {
        getResponse();
    }
}

function heartButton() {
    buttonSendText("Heart clicked!")
}

// Press enter to send a message
$("#textInput").keypress(function (e) {
    console.log(isWaiting);
    if (e.which == 13 && isWaiting == false) {
        getResponse();
    }
});
