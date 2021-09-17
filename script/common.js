var https="http://2018.cool/";

function getUrl(){
  return https;
}
// 注:时间戳转时间（ios手机NaN）
function timestamp(timestamp){
  var d = new Date(timestamp * 1000);    //根据时间戳生成的时间对象
  var date = (d.getFullYear()) + "-" +
            (d.getMonth() + 1) + "-" +
            (d.getDate())
  return date
}
function request1(url,method, data, callBack, callbackerror) {
    // console.log(JSON.stringify(data));
    api.showProgress({
         title: '加载中...',
         text: '',
     });
    api.ajax({
        url: https+url,
        method: method,
        headers: {'Content-Type': 'application/json'},
        data: {
          body:data
        }
    }, function(ret, err) {
        api.hideProgress();
        if (ret) {
            // console.log(JSON.stringify(ret));
            if(ret.code==1){
              callBack(ret);
            }else{
              console.log(ret.code);
              api.toast({
                msg:ret.msg,
                location:"middle"
              });
            }
        } else {
              console.log(JSON.stringify(err));
            callbackerror && callbackerror(err);
        }
    });
}
function request2(url,method, data, callBack, callbackerror){
  api.showProgress({
       title: '加载中...',
       text: '',
   });
  // console.log("token:"+$api.getStorage("token"));
  if(!$api.getStorage("token")){
    // 如果未登录，请先登录
    login();
    return false;
  }
  api.ajax({
      url: https+url,
      method: method,
      headers: {
          'Content-Type': 'application/json',
          'Token':$api.getStorage("token")
      },
      data: {
        body:data
      }
  }, function(ret, err) {
      api.hideProgress();
      //  console.log(JSON.stringify(ret));
      if (ret) {
          if(ret.code==1){
            callBack(ret);
          }else if(ret.code == 3){
            api.confirm({
                title: '提示',
                msg: '您还未实名认证，去认证？?',
                buttons: ['暂不认证', '确定']
            }, function(ret, err) {
                if(ret.buttonIndex==2){
                  api.openWin({
                      name: 'certification',
                      url: 'widget://html/HSE/certification.html'
                  });
                }
            });
          }else if (ret.code == 4) {
            api.confirm({
                title: '提示',
                msg: '您还未设置支付密码，去设置?',
                buttons: ['取消', '确定']
            }, function(ret, err) {
                if(ret.buttonIndex==2){
                  api.openWin({
                      name: 'psd_pay',
                      url: 'widget://html/HSE/psd_pay.html'
                  });
                }
            });
          }else{
            api.toast({
              msg:ret.msg,
              location:"middle"
            });
          }
      } else {
        console.log(JSON.stringify(err));
        if(err.body.code==401){
          console.log("token过期");
          api.sendEvent({
              name: 'loginout'
          });
        }
        api.hideProgress();
          callbackerror && callbackerror(err);
      }
  });
}
//点击登录
function login(){
  // console.log("登录");
  api.confirm({
      title: '提示',
      msg: '去登陆？',
      buttons: ['马上登录','暂不登陆']
  }, function(ret, err) {
      if(ret.buttonIndex==1){
        publicLogin();
      }
  });
}
function publicLogin(){
  $api.clearStorage("token");
  // api.openFrame({
  //     name: 'login',
  //     url: 'widget://html/account/login.html',
  //     rect: {
  //         x: 0,
  //         y: 0,
  //         w: api.winWidth,
  //         h: api.winHeight
  //     },
  //     bounces: false,
  //     vScrollBarEnabled: false,
  //     hScrollBarEnabled: false
  // });
  api.openWin({
      name: 'login',
      url: 'widget://html/account/login.html'
  });
}
// /**
// * 判断APP是否持有该权限
// * @param array   one_per   - 权限数组['camera','location']
// */
function hasPermission(one_per) {
   var rets = api.hasPermission({
       list: one_per
   });

 //获取需要判断的权限
 var temp = new Array();
 var status = true;
 for (var obj in rets) {
   var granted = rets[obj].granted;
   var names = rets[obj].name;
   if (granted == false) {
     temp.push(names);
     status = false;
   }
 }
 //返回结果，和需要申请的权限
   return  { "status": status, "perms": temp };
}

// /**
// * 获取权限
// *@param array  one_per   - 权限数组['camera','location']
// *@param function  callback   - 回调函数
// */
function reqPermission(one_per,callback) {
   api.requestPermission({
       list: one_per,
       code: 100001
   }, function(ret, err) {
   //获取处理结果
   var list = ret.list;
   for (var i in list) {
     //只有有一项权限不足，就返回
     if (list[i].granted == false) {
       api.toast({
           msg: '权限不足，无法进行下一步操作',
           duration: 2000,
           location: 'bottom'
       });
       return false;
     }
   }
       if (callback) {
           callback();
           return;
       }
   });
}

/**
* 判断是否持有数组中的权限，无权限获取对应的权限
* @param array  perm    - 权限数组['camera','location']
* @param function  callback   - 回调函数
*/
function confirmPer(perm, callback) {
 //权限类型有
 //calendar日历，camera相机，contacts通讯录，location位置信息，microphone麦克风
 //phone电话，sensor身体传感器，sms短信，storage存储空间，photos相册
 console.log(perm);

 //ios系统直接跳过
 if(api.systemType == 'ios'){
   // callback();
   // return false;
 }
 //判断多个权限是，使用 ,（英文逗号隔开）
   if (perm.indexOf(",") != -1) {
       var perms = perm.split(',');
   } else {
   var perms = new Array(perm);
   }

 //判断是否持有该数组中的权限
   var has = hasPermission(perms);
 console.log(JSON.stringify(has));
   if (!has.status) {
   //获取权限
       reqPermission(has.perms,callback);
       return false;
   }

 callback();
   return true;
}
