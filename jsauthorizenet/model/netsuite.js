const fetch = require('node-fetch');

var test_sl = function(){
    this.push = async (data) => {
        try{
            console.log("Sending data:", data);

            var nsdata = await fetch('https://tstdrv1697389.extforms.netsuite.com/app/site/hosting/scriptlet.nl?script=362&deploy=1&compid=TSTDRV1697389&h=8b2c42fe349f7759db84', {
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