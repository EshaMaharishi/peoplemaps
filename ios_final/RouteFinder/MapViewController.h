//
//  MapViewController.h
//  RouteFinder
//
//  Created by Sameer Lal on 12/5/14.
//  Copyright (c) 2014 AbhiandEsha. All rights reserved.
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


