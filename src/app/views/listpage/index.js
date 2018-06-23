import fetchData from '../../common/fetchData';

export default function showProductList(req, res, next) {
    let productData = {};
    async function getData() {
        let apiUrl = 'https://amptalk-api-555fd.firebaseapp.com/productlist.json';
        let reqOptions = {
            type: 'GET',
            url: apiUrl,
        }
        try {
            let apiPromise = await fetchData(reqOptions);
            if(apiPromise.statusCode == 200){
                let body = apiPromise.body;
                productData = Object.assign({}, productData, { listContent: body.data });
                OnSuccess();
            }
        } catch (error) {
            console.log("Some error encountered", error);
            return false;
        }
    }

    function OnSuccess(){
        if(Object.keys(productData).length > 0 && productData.hasOwnProperty('listContent')) {
            // console.log("listdata",JSON.stringify(productData));
            res.render('listpage/listpage.html', { productData });
        }
    }

    getData();

}