import $ from 'jquery';
import { serveUrl, User, cacheData, access_token} from './config';

function getTrainStation (value,callback) {
    $.ajax({
        type: "GET",
        url: serveUrl + 'hsr-order/getTrainStationDropdownList?access_token='+User.appendAccessToken().access_token,
        data:{name:value},
        success:function(data){
            if(data.status == 200 && data.data.length !== 0){
                //return data.data
                callback(data.data)
                //console.log(data.data)
            }
            
        }
    });
};

export default getTrainStation;