import fetchData from '../../common/fetchData';

export default function showProductList(req, res, next) {
    let productData = {};
    console.log(`request params is ${req}`);
    async function getData() {
        let apiUrl = 'https://amptalk-api-555fd.firebaseapp.com/productlist.json';
        
        if(req.query.color && req.query.color){
            let color = req.query.color.toLowerCase();
            apiUrl = 'https://amptalk-api-555fd.firebaseapp.com/productlist_'+color+'.json';
        }
        let reqOptions = {
            type: 'GET',
            url: apiUrl,
        }
        try {
            let apiPromise = await fetchData(reqOptions);
            if(apiPromise.statusCode == 200){
                let body = apiPromise.body;
                productData = Object.assign({}, productData, { listContent: body.data, filterOptions: body.filterOptions });
                OnSuccess();
            }
        } catch (error) {
            console.log("Some error encountered", error);
            return false;
        }
    }

    function OnSuccess(){
        if(Object.keys(productData).length > 0 && productData.hasOwnProperty('listContent')) {
            res.render('listpage/listpage.html', { productData });
        }
    }

    getData();

}