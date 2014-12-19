var r = function(x_min,x_max,y_min,y_max){
  r_arr=[];
  x_r=Math.random()*(x_max-x_min)+x_min;
  y_r=Math.random()*(y_max-y_min)+y_min;
  r_arr.push(x_r);
  r_arr.push(y_r);
  return r_arr;
}

var path = function(start,end){
  points=[];
  points.push(start);
  var x_min=start[0];
  var x_max=end[0];
  var y_min=start[1];
  var y_max=end[1];
  for(var i=1;i<10;i++){
     random_point=r(x_min,x_max,y_min,y_max);
     points.push(random_point);
     x_min=random_point[0];
     y_min=random_point[1];
  }
  points.push(end);
  return points;
}

var create_doc = function(start,end){
  var doc = {};
  doc.start=start;
  doc.end=end;
  doc.points= path(doc.start,doc.end);
  db.userData.insert(doc);
}

var s = [40.8075,-73.9619];
var e = [40.8100,-73.9500];

for (var i=0;i<10;i++){
	create_doc(s,e);
}

