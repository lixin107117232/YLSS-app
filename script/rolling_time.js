/**
 * 输入时间倒计时
 * @param {string} 指定时间
 * @return {object} 返回时间相关JSON数据 
 **/
function countDown(end_time) {
    var start_time = new Date();
	var ms = Date.parse(new Date( GiveTheSpecifiedTime(end_time) )) - Date.parse(start_time);
    var minutes = 1000 * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    var years = days * 365;
    var d = Math.floor(ms / days);
    ms %= days;
    var h = Math.floor(ms / hours);
    ms %= hours;
    var m = Math.floor(ms / minutes);
    ms %= minutes;
    var s = Math.floor(ms / 1000);
	return {end_time:d+"天"+h+"时"+m+"分"+s+"秒",days:d,hour:h,minute:m,second:s};
}

function getNowTime(type){
      let dateTime;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes():new Date().getMinutes();
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds():new Date().getSeconds();
      switch(parseInt(type)){
		  case 1:
			dateTime = yy + '-' + mm + '-' + dd;
		  break;
		  case 2:
			dateTime = hh + ':' + mf + ':' + ss;
		  break;
		  case 3:
		  	dateTime = yy+""+mm +""+dd+""+hh +""+mf+""+ss;
		  break;
		  default:
			dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss;
	  }
	  
      return dateTime;
}

function GiveTheSpecifiedTime(time){
	return getNowTime(1)+" "+time;
}

function GiveTheSpecifiedTimeStamp(time){
	return Date.parse(new Date(getNowTime(1)+" "+time));
}
// 获取当前时间戳
function TimeStamp(){
	return new Date().getTime();
}