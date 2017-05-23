import $ from 'jquery';
function getTrainStation (value,callback) {
    $.ajax({
        type: "GET",
        url: 'http://192.168.0.147:8888/hsr-order/getTrainStationDropdownList?access_token=gR635UXIUIqSTAmsjmfZi1jrcDn1g12Yb9ezWTCR',
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