const axios = require('axios') ; 


// kita mau fetch testind dari beberapa endpoint 

async function testApi() { 
    try { 
        // test 1 
        const addressEligible = await axios.get('http://localhost:5000/api/eligible-addresses') ; 
        
        // mencari address tertentu yang ada di eligible-addresses.json
        const findAddress = addressEligible.data.eligibleAddresses.find(address => address === '0xb992790667b61ad62b3b525d514662b716049ccd') ; 
        console.log(findAddress) ; 
    } catch (error){ 
        console.error('Error fetching eligible addresses:', error) ; 
    }
}

testApi() ; 