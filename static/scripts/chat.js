// Collapsible
var coll = document.getElementsByClassName("collapsible");

let isWaiting = false;

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

    setTimeout(() => {
        var data = {
            prompt: userText
        };

        var botPromise = $.ajax({
            url: "https://totonou-project-chatbot-gateway-407tq1ig.an.gateway.dev/",
            headers: {
                'Content-Type': 'application/json',
            },
            type: 'POST',
            data: JSON.stringify(data),
            dataType: 'json',
        });
        
        let botHtml = '<p id="loadingText" class="botText"><span><span>ChatGPTが回答を作成中です...</span></span></p>';
        $("#chatbox").append(botHtml);
        document.getElementById("chat-bar-bottom").scrollIntoView(true);

        botPromise.then(function(res, textStatus, jqXHR) {
            $("#loadingText").remove();
            let botHtml = '<p class="botText"><span>' + res['answer'] + '</span></p>';
            $("#chatbox").append(botHtml);
            document.getElementById("chat-bar-bottom").scrollIntoView(true);
            console.log(res['answer']);
            isWaiting = false;
        }, function(jqXHR, textStatus, errorThrown) {
            $("#loadingText").remove();
            console.log('Failed.');
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
