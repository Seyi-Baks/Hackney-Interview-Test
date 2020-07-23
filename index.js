const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

const PORT = process.env.PORT || 3000;
const app = express();
dotenv.config();

//Cors
app.use(cors());

//Body-Parser - To send JSON to the api
app.use(express.json());


app.get('/get-address', async (req, res) => {
    //get postcode from parameters
    const { postcode } = req.query;

    //Check to see if parameter is passed
    if (!postcode) {
        res.status(400).json({ success: false, message: 'Please pass a postcode as a parameter' });
    }

    //Check to see if parameter is the correct format
    if (!checkPostCode(postcode)) {
        res.status(400).json({ success: false, message: 'Incorrect postcode format' });
    }


    try {

        const response = await axios.get(`https://ndws9fa08d.execute-api.eu-west-2.amazonaws.com/development/api/v1/addresses/?postcode=${postcode}`, {
            headers: {
                'x-api-key': process.env.API_KEY
            }
        });

        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
})

const checkPostCode = (postCode) => {
    const regex = /^[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}$/i;

    if (regex.test(postCode)) {
        return true;
    }
    return false;
}

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});