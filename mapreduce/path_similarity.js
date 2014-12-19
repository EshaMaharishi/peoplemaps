//creating the best paths 
var createBestPaths=function(d) {
  doc={};
  var s_e=d._id;
  var best_path=d.value.bestPath;
  var s = [];
  var e = [];
  s.push(s_e[0]);
  s.push(s_e[1]);
  e.push(s_e[2]);
  e.push(s_e[3]);
  doc.start=s;
  doc.end=e;
  doc.bestPath=best_path;
  db.bestPaths.insert(doc);
}
//map function which starts using points

var map = function(){ 
  print("Begin map");
  var x_min = Math.round(this.start[0] * 100) / 100;
  var y_min = Math.round(this.start[1] * 100) / 100;
  var x_max = Math.round(this.end[0] * 100) / 100;
  var y_max = Math.round(this.end[1] * 100) / 100;
  var s = [];
  var e = [];
  s.push(x_min);
  s.push(y_min);
  e.push(x_max);
  e.push(y_max); 
  emit(s.concat(e),this.points);  
}
//reduce which does path computation
var reduce = function(start_end,paths){
  print("Begin reduce");
var sim = function(p1,p2) {
   var epsilon = 0.001;
   var intersection=0.0;
   var union= Math.min(p1.length,p2.length);
   var smaller_path=null;
   var larger_path=null;
   if (p1.length <= p2.length) {
         smaller_path=p1;
         larger_path=p2;
   }
   else {
         smaller_path=p2;
         larger_path=p1;
   }
   for (var i =0; i<smaller_path.length;i++){
      point_1=smaller_path[i];
      for (var j = 0; j<larger_path.length;j++){
        point_2=larger_path[j];
        if (Math.sqrt(Math.pow((point_1[0]-point_2[0]),2)+Math.pow((point_1[1]-point_2[1]),2))<epsilon){
          intersection = intersection + 1.0;
          break;
      }
    }
 
   }
   return intersection/union;
}
/*
var get_best_path=function(L){
  print("Length of largest bucket");
  print(L.length);
  print("Largest bucket is");
  print(L);
  var random_index= Math.floor(Math.random() * (L.length - 0 + 1)) + 0;
  return L[random_index];
}
*/
var buckets = function(all_paths) {
  print("Begin algorithm");
  var b_s=[];
  for(var i = 0; i<all_paths.length; i++){
    similar_paths=[];
    for (var j = 0; j<all_paths.length; j++){
      if (j != i){
        similarity = sim(all_paths[i],all_paths[j]);
        print("Similarity of " + i + "and " + j + "is " + similarity);
        if (similarity >= .90) {
          similar_paths.push(all_paths[j]);
          }
        }

      }
      print("Number of similar paths for path  " + i);
      print(similar_paths.length)
      b_s.push(similar_paths);
    }
    return b_s;
}
//retrieving most popular buckets
var get_largest_buckets = function(B) {
  var max = -1;
  var max_index = -1;
  for (var i = 0; i<B.length;i++){
    if (B[i].length > max){
         max=B[i].length;
         max_index=i;
    }     
  }
  
  return max_index;
}

  var s = [];
  var e = [];
  var x_min=start_end[0];
  var y_min = start_end[1];
  s.push(x_min);
  s.push(y_min);
  var x_max=start_end[2];
  var y_max=start_end[3];
  e.push(x_max);
  e.push(y_max);
  var all_buckets=buckets(paths);
  var largest_bucket_index = get_largest_buckets(all_buckets);
  var bp = paths[largest_bucket_index];
  print(bp);
  return {bestPath: bp};   
}

var first_doc = { start : [40.80665708738505,-73.9611441069153], end:[40.80988608303819, -73.95049467524416], points : [[40.80665708738505, -73.9611441069153],
        [40.80688447111091, -73.96101536088258],
        [40.807063129206085, -73.96088661484987],
        [40.807258028397726, -73.96071495347292],
        [40.80750165158235, -73.9605862074402],
        [40.80774527387255, -73.96037163071901],
        [40.808037619440206, -73.9601355963257],
        [40.80831372240483, -73.95996393494875],
        [40.80855734171373, -73.9597922735718],
        [40.808752236516895, -73.95962061219484],
        [40.80902833650816, -73.95942749314577],
        [40.80927195319348, -73.95925583176881],
        [40.80951556898441, -73.9591270857361],
        [40.809840388647686, -73.95884813599855],
        [40.81016520672094, -73.95861210160524],
        [40.810441300832984, -73.95839752488405],
        [40.8106361901028, -73.9582258635071],
        [40.81091228225512, -73.95803274445802],
        [40.811188373258624, -73.95786108308107],
        [40.81129902909821, -73.95779028376467],
        [40.81159135900929, -73.95756497820742],
        [40.81190804829287, -73.9573289438141],
        [40.81220849570312, -73.95714655360109],
        [40.81247646116442, -73.95691051920778],
        [40.812923067861576, -73.956588654126],
        [40.81321539061737, -73.95638480624086],
        [40.81332095129597, -73.95627751788027],
        [40.8129799084983, -73.95599856814272],
        [40.81274442554347, -73.95576253374941],
        [40.81232217815221, -73.95542993983156],
        [40.81199737063804, -73.9550758882416],
        [40.81173752348185, -73.95481839617617],
        [40.811420833384354, -73.95413175066835],
        [40.811185344896074, -73.95362749537355],
        [40.8110066978992, -73.95315542658693],
        [40.81077932829839, -73.95259752711183],
        [40.81077932829839, -73.95203962763674],
        [40.8102921051017, -73.95147099932558],
        [40.81016217831168, -73.95110621889955],
        [40.81000788991811, -73.95078435381777],
        [40.80988608303819, -73.95049467524416]] };

//getting similar paths
var getSimilarDoc = function(d){
   var doc = {};
   var small_delta = 0.0001;
   doc.start=d.start;
   doc.end=d.end;
   var paths = d.points;
   var path = [];
   path.push(doc.start);
   for (var i = 0;i<paths.length; i++) {
      var point=[];
      var x = paths[i][0];
      var y = paths[i][1];
      var new_x= x+small_delta;
      var new_y= y+small_delta;
      point.push(new_x);
      point.push(new_y);
      path.push(point);
   }
   path.push(doc.end);
   doc.points=path;
   return doc;
}

var second_doc = getSimilarDoc(first_doc);
var third_doc = { start : [40.8068245966909, -73.96104112109072], end : [40.810251503007144, -73.95110621889955], points : [[40.8068245966909, -73.96104112109072],
        [40.80659721275988, -73.96124496897585],
        [40.8062886190359, -73.9614166303528],
        [40.80601250764542, -73.96164193591005],
        [40.80568766924468, -73.96187797030336],
        [40.80550088644428, -73.9620281740082],
        [40.805395313324574, -73.96170630892641],
        [40.80527349797773, -73.96140590151674],
        [40.805086714011644, -73.96103039225466],
        [40.80492429274427, -73.96065488299257],
        [40.80474562889104, -73.96023645838625],
        [40.804631933461295, -73.95993605097658],
        [40.804631933461295, -73.95976438959963],
        [40.804315209451325, -73.95964637240297],
        [40.804225876765, -73.95951762637026],
        [40.804225876765, -73.95949616869814],
        [40.80468066009788, -73.9594532533539],
        [40.804794355444166, -73.9593459649933],
        [40.80462381235169, -73.95917430361635],
        [40.804518237836746, -73.95899191340334],
        [40.804518237836746, -73.9587880655182],
        [40.80427460369972, -73.95862713297731],
        [40.80407969574616, -73.95857348879701],
        [40.80411218044483, -73.95829453905947],
        [40.80389290842021, -73.95820870837099],
        [40.803754847884875, -73.95785465678102],
        [40.80356805964468, -73.95740404566652],
        [40.80337314961615, -73.95694270571596],
        [40.80319448158719, -73.95645990809328],
        [40.80311326868774, -73.9563204332245],
        [40.80349496845104, -73.95605221232302],
        [40.803811696375384, -73.95580544909365],
        [40.80424211908056, -73.95546212633974],
        [40.804631933461295, -73.95520463427431],
        [40.80496489809838, -73.954968599881],
        [40.8054196763671, -73.95462527712709],
        [40.80593941914388, -73.95426049670107],
        [40.80636982804975, -73.95394936045534],
        [40.8067677507812, -73.95362749537355],
        [40.80718191272268, -73.95335927447206],
        [40.808123918493365, -73.95264044245607],
        [40.80853807197094, -73.95232930621034],
        [40.80896846402249, -73.95202889880068],
        [40.80939885328254, -73.95170703371889],
        [40.8098779625716, -73.95139589747316],
        [40.810251503007144, -73.95110621889955]] };

//adding points to database
db.userData.remove({});
db.userData.insert(first_doc);
db.userData.insert(second_doc);
db.userData.insert(third_doc);
db.bestPaths.remove({});
print("Begin map reduce");
db.userData.mapReduce(map,reduce, {out:"temp_output"});
print("Finish map reduce");
db.temp_output.find().forEach( function(myDoc) {createBestPaths(myDoc)});
db.temp_out.remove({});


