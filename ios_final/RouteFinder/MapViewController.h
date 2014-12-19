//
//  MapViewController.h
//  RouteFinder
//
//
//  
//

#import <UIKit/UIKit.h>
#import <MapKit/MapKit.h>

@interface MapViewController : UIViewController{
    IBOutlet UILabel *result;
    IBOutlet MKMapView *map;
    IBOutlet NSString *kBaseUrl;
}


@property (nonatomic,strong) NSMutableArray *points;

@end


