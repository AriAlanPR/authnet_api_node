const fetch = require('node-fetch');

var test_sl = function(){
    this.push = async (data) => {
        try{
            console.log("Sending data:", data);

            var nsdata = await fetch('netsuite_url_here', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify(data)
            });

            console.log("Netsuite response: ", nsdata);

            return await nsdata.json();
        } catch(e) {
            console.log(e.message);
            return {
                Error: "Error",
                message: e.message
            }
        }
    }
}

exports.suiteletCall = test_sl;
