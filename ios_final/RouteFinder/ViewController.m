//
//  ViewController.m
//  RouteFinder
//
//
//  Implements the main view controller with the startup screen
// starts the location services as soon as application starts
//

#import "ViewController.h"
#import "MapViewController.h"
#import <Foundation/NSJSONSerialization.h>

@interface ViewController ()  <CLLocationManagerDelegate>
@property (assign, nonatomic) CLLocation *loc;
@property (nonatomic, strong) CLLocationManager *locationManager;
@end

@implementation ViewController

int addPath = 0;
int counter = 0;
NSMutableArray *path_arr;
NSMutableArray *start_arr;
NSMutableArray *end_arr;

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view, typically from a nib.
    /*
     if([self locationServicesAvailable] == NO){
     return;
     }
     BOOL hasAlwaysKey = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationAlwaysUsageDescription"] != nil;
     BOOL hasWhenInUseKey = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"NSLocationWhenInUseUsageDescription"] != nil;
     if (hasAlwaysKey) {
     [self.locationManager requestAlwaysAuthorization];
     }
     else {
     // At least one of the keys NSLocationAlwaysUsageDescription or NSLocationWhenInUseUsageDescription MUST be present in the Info.plist file to use location services on iOS 8+.
     NSAssert(hasAlwaysKey || hasWhenInUseKey, @"To use location services in iOS 8+, your Info.plist must provide a value for either NSLocationWhenInUseUsageDescription or NSLocationAlwaysUsageDescription.");
     }
     */
    
    path_arr = [[NSMutableArray alloc] init];
    start_arr = [[NSMutableArray alloc] init];
    end_arr = [[NSMutableArray alloc] init];
    
    if ([CLLocationManager locationServicesEnabled]) {
        
        if([CLLocationManager authorizationStatus]==kCLAuthorizationStatusDenied){
            NSLog(@"fuck you");
        }
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.delegate = self;
        self.locationManager.desiredAccuracy=kCLLocationAccuracyBest;
        self.locationManager.distanceFilter=kCLDistanceFilterNone;
        [self.locationManager requestAlwaysAuthorization];
        [self.locationManager startMonitoringSignificantLocationChanges];
        [self.locationManager startUpdatingLocation];
        NSLog(@"Location services are enabled");
    } else {
        NSLog(@"Location services are not enabled");
    }
}

- (void) calculateRoute:(id)sender{
    [self performSegueWithIdentifier:@"calculateMap" sender:sender];
}

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([segue.identifier isEqualToString:@"calculateMap"]) {
        NSString *start_data=start.text;
        NSString *end_data=end.text;
        
        MapViewController *map=(MapViewController *)segue.destinationViewController;
        map.points=[[NSMutableArray alloc] init];
        [map.points addObject:start_data];
        [map.points addObject:end_data];
    }
    
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

//method for updating locations

- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations
{
    _loc =[locations lastObject];
    // NSLog(@" NAGU %@", [locations lastObject]);
    
    
    float xcoord =_loc.coordinate.latitude;
    float ycoord = _loc.coordinate.longitude;
    NSNumber *x = [NSNumber numberWithFloat:xcoord];
    NSNumber *y = [NSNumber numberWithFloat:ycoord];
    
    NSMutableArray *point =[[NSMutableArray alloc] init];
    [point addObject:x];
    [point addObject:y];
    
    
    //get the point (we call it point)
    
    if (addPath == 1) {
        
        //we first check if end_arr is full
        NSUInteger size = [end_arr count];
        
        if (size  == 5) {
            addPath = 0;
            [start_arr addObject:point];
            [end_arr removeAllObjects];
            
            //remove last five objects of the path
            NSMutableIndexSet *discardedItems = [NSMutableIndexSet indexSet];
            NSUInteger path_size = [path_arr count];
            
            
            for (int i = 1; i < 6; i++) {
                NSUInteger num = path_size - i;
                [discardedItems addIndex: num];
            }
            
            
            [path_arr removeObjectsAtIndexes:discardedItems];
            
            
            //send path to node.js stuff here
            /*
            id objectInstance;
            NSUInteger indexKey = 0U;
            
            NSMutableDictionary *mutableDictionary = [[NSMutableDictionary alloc] init];
            for (objectInstance in path_arr)
                [mutableDictionary setObject:objectInstance forKey:[NSNumber numberWithUnsignedInt:indexKey++]];
    
            NSMutableString *urls = [[NSMutableString alloc]init];
            [urls appendString:@"http://peoplemaps-env.elasticbeanstalk.com/"];
            // TODO: change from userData to bestPaths; currently bestPaths is waiting on the MR algorithm to be populated
            [urls appendString:@"userData/$"];
            
            NSNumber *startLat = [[path_arr firstObject] objectAtIndex:0];
            NSNumber *startLong = [[path_arr firstObject] objectAtIndex:1];
            NSNumber *endLat = [[path_arr lastObject] objectAtIndex:0];
            NSNumber *endLong = [[path_arr lastObject] objectAtIndex:1];

            NSString *starts = [[NSString alloc] initWithFormat:@"%@_%@_", startLat, startLong];
            NSString *ends = [[NSString alloc] initWithFormat:@"%@_%@", endLat, endLong];
            [urls appendString:starts];
            [urls appendString:ends];
            
            NSURL* url = [NSURL URLWithString:urls];
            NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:url];
            request.HTTPMethod = @"POST";
            
            NSData* data = [NSJSONSerialization dataWithJSONObject:mutableDictionary options:0 error:NULL];
            request.HTTPBody = data;
            
            [request addValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
            
            NSURLSessionConfiguration* config = [NSURLSessionConfiguration defaultSessionConfiguration];
            NSURLSession* session = [NSURLSession sessionWithConfiguration:config];
            
            NSURLSessionDataTask* dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) { //5
                if (!error) {
                    NSLog(@"Sent new path");
                }
            }];
            [dataTask resume];
            */
            
            NSLog(@"The content of the array is %@", path_arr);
            [path_arr removeAllObjects];
            
            
        } else {
            
            if (size == 0) {
                [end_arr addObject:point];
                [path_arr addObject:point];
                
                
            } else if ([point isEqualToArray:[end_arr objectAtIndex:size -1]]) {
                [end_arr addObject:point];
                [path_arr addObject:point];
            }
            
        }
        
    } else {
        
        //we first check if start_arr is full
        NSUInteger size = [start_arr count];
        
        if (size == 5) {
            addPath = 1;
            [path_arr addObjectsFromArray:start_arr];
            [start_arr removeAllObjects];
            counter = 0;
            
        } else {
            
            NSLog(@"Reading in the points");
            
            if (counter < 5) {
                counter = counter + 1;
                
                if (size == 0) {
                    [start_arr addObject:point];
                    
                } else {
                    if (![point isEqualToArray:[start_arr objectAtIndex:size -1]]) {
                        [start_arr addObject:point];
                        NSLog(@"Adding point");
                        
                        
                    }
                    
                }
                
            } else {
                [start_arr removeAllObjects];
                [start_arr addObject:point];
                
                counter = 0;
                
            }
            
        }
        
    }
    
}
//checks if location services is on

- (BOOL) locationServicesAvailable{
    if ([CLLocationManager locationServicesEnabled] == NO) {
        return NO;
    } else if ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusDenied) {
        return NO;
    } else if ([CLLocationManager authorizationStatus] == kCLAuthorizationStatusRestricted) {
        return NO;
    }
    return YES;
}

@end
