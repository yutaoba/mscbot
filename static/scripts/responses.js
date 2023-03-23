async function getBotResponse(input) {
    //rock paper scissors
    if (input == "rock") {
        return "paper";
    } else if (input == "paper") {
        return "scissors";
    } else if (input == "scissors") {
        return "rock";
    } else {
        let result;
        var data = {
            prompt: input
        };
        try {
            result = $.ajax({
                url: "https://totonou-qa-by-yuta-gateway-57yiso8q.an.gateway.dev/",
                headers: {
                    'Content-Type': 'application/json',
                },
                type: 'POST',
                data: JSON.stringify(data),
                dataType: 'json',
                success: function(res) {
                    console.log(res['answer']);
                }
            });
            return result;
        } catch (error) {
            console.error(error);
        }
    }
}