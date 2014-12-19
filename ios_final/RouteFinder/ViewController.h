//
//  ViewController.h
//  RouteFinder
//

//

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h> 

extern int addPath;
extern int counter;
extern NSMutableArray *path_arr;
extern NSMutableArray *start_arr;
extern NSMutableArray *end_arr;

@interface ViewController : UIViewController{
    IBOutlet UITextField *start;
    IBOutlet UITextField *end;
}

-(IBAction)calculateRoute:(id)sender;

@end

