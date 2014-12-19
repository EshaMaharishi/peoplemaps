//
//  MapViewController.m
//  RouteFinder
//
//  Created by Sameer Lal on 12/5/14.
//  Copyright (c) 2014 AbhiandEsha. All rights reserved.
//

#import "MapViewController.h"

@interface MapViewController ()

@property (assign, nonatomic) CLLocation *loc;
@property (nonatomic, strong) CLLocationManager *locationManager;

@end

@implementation MapViewController

@synthesize points;

- (void)viewDidLoad {
    [super viewDidLoad];
    
    CLGeocoder *geocoder = [[CLGeocoder alloc] init];
    NSString *startAddress =points[0];
    NSString *endAddress = points[1];
    __block CLLocationCoordinate2D  coord;
    __block CLLocationCoordinate2D endCoord;
    
    [geocoder geocodeAddressString: startAddress completionHandler:^(NSArray *placemarks, NSError *error){
        if(placemarks.count > 0)
        {
            CLPlacemark *placemark = [placemarks objectAtIndex:0];
            CLLocation *location = placemark.location;
            NSLog(placemark.location.description);
            coord = location.coordinate;
            float latitude = coord.latitude;
            float longitude = coord.longitude;
            
            [geocoder geocodeAddressString: endAddress completionHandler:^(NSArray *placemarks, NSError *error){
                if(placemarks.count > 0){
                    
                    CLPlacemark *placemark = [placemarks objectAtIndex:0];
                    CLLocation *location = placemark.location;
                    endCoord = location.coordinate;
                    float endLatitude = endCoord.latitude;
                    float endLongitude = endCoord.longitude;
                    NSLog(@"end latitude :%f", endLatitude);
                    NSLog(@" end longitude :%f", endLongitude);
                    
                    CLLocationCoordinate2D start;
                    //      start.latitude=40.8068245966909;
                    //      start.longitude=-73.96104112109072;
                    CLLocationCoordinate2D end;
                    //      end.latitude=40.810251503007144;
                    //      end.longitude=-73.95110621889955;
                    
                    start.latitude=latitude;
                    start.longitude=longitude;
                    end.latitude=endLatitude;
                    end.longitude=endLongitude;
                    
                    NSMutableString *urls = [[NSMutableString alloc]init];
                    [urls appendString:@"http://peoplemaps-env.elasticbeanstalk.com/"];
                    // TODO: change from userData to bestPaths; currently bestPaths is waiting on the MR algorithm to be populated
                    [urls appendString:@"userData/$"];
                    
                    NSString *starts = [[NSString alloc] initWithFormat:@"%g_%g_", start.latitude, start.longitude];
                    NSString *ends = [[NSString alloc] initWithFormat:@"%g_%g", end.latitude, end.longitude];
                    [urls appendString:starts];
                    [urls appendString:ends];
                    
                    NSLog(urls);
                    
                    NSURL* url = [NSURL URLWithString:urls];
                    
                    NSMutableURLRequest* request = [NSMutableURLRequest requestWithURL:url];
                    request.HTTPMethod = @"GET";
                    [request addValue:@"application/json" forHTTPHeaderField:@"Accept"];
                    
                    NSURLSessionConfiguration* config = [NSURLSessionConfiguration defaultSessionConfiguration];
                    NSURLSession* session = [NSURLSession sessionWithConfiguration:config];
                    
                    NSURLSessionDataTask* dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                        if (error == nil) {
                            NSArray* responseArray = [NSJSONSerialization JSONObjectWithData:data options:0 error:NULL];
                            NSLog(@"array: %@", responseArray);
                            NSMutableArray* locations = [[NSMutableArray alloc] init];
                            CLLocationCoordinate2D location;
                            MKPointAnnotation* myAnn;
                            
                            for(id loc in responseArray){
                                myAnn = [[MKPointAnnotation alloc] init];
                                location.latitude = [[loc objectAtIndex:0] doubleValue];
                                location.longitude = [[loc objectAtIndex:1] doubleValue];
                                myAnn.coordinate = location;
                                [locations addObject:myAnn];
                            }
                            
                            MKCoordinateSpan span;
                            span.latitudeDelta = 2*fabs(end.latitude - start.latitude);
                            span.longitudeDelta = 2*fabs(end.longitude - start.longitude);
                            
                            MKCoordinateRegion region;
                            CLLocationCoordinate2D centerLoc;
                            centerLoc.latitude = start.latitude + (end.latitude - start.latitude)/2;
                            centerLoc.longitude = start.longitude + (end.longitude - start.longitude)/2;
                            region.center = centerLoc;
                            region.span = span;
                            
                            [map setRegion:region];
                            [map addAnnotations:locations];
                            [map setCenterCoordinate:region.center animated:YES];
                        }
                        else {
                            NSLog(@"error loading best path");
                            NSLog(@"Error: %@ %@", error, [error userInfo]);
                        }
                    }];
                    [dataTask resume];
                }
            }];
        }
    }];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
