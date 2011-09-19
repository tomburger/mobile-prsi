package cz.burger.android.phonegap.mobileprsi;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;

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
        
        SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
        
        String color_schema = pref.getString(
									getString(R.string.color_schema_key), 
									getString(R.string.color_schema_default)); 
        String language = pref.getString(
									getString(R.string.language_key), 
									getString(R.string.language_default)); 
        
        super.loadUrl("file:///android_asset/www/index.html?" 
        		    + color_schema + "&" + language);
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        MenuInflater inflater = getMenuInflater();
        inflater.inflate(R.menu.main_menu, menu);
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
    	switch (item.getItemId()) {
    	case R.id.settings:
    		startSettings();
    		return true;
    	case R.id.rules:
    		startRules();
    		return true;
    	case R.id.about:
    		startAbout();
    		return true;
    	default:
    		return super.onOptionsItemSelected(item);
    	}
	}
    
    private void startAbout() {
    	Intent intent = new Intent(this, About.class);
    	startActivity(intent);
    }
    
    private void startSettings() {
    	Intent intent = new Intent(this, Settings.class);
    	startActivity(intent);
    }
    
    private void startRules() {
    	Intent intent = new Intent(this, Rules.class);
    	startActivity(intent);
    }
    
}