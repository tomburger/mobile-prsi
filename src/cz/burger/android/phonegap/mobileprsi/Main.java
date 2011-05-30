package cz.burger.android.phonegap.mobileprsi;

import android.os.Bundle;

import com.google.android.apps.analytics.GoogleAnalyticsTracker;
import com.phonegap.*;

public class Main extends DroidGap {

	// Google Analytics Code: UA-23677989-1
	GoogleAnalyticsTracker tracker;
	
	/** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        tracker = GoogleAnalyticsTracker.getInstance();
        tracker.start("UA-23677989-1", this);
        tracker.trackPageView("/App-Started");
        tracker.dispatch();
        
        super.loadUrl("file:///android_asset/www/index.html");
    }
}