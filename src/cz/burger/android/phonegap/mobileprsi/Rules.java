package cz.burger.android.phonegap.mobileprsi;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;

import com.phonegap.DroidGap;

public class Rules extends DroidGap {

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        SharedPreferences pref = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
        
        String color_schema = pref.getString(
									getString(R.string.color_schema_key), 
									getString(R.string.color_schema_default)); 
        String language = pref.getString(
									getString(R.string.language_key), 
									getString(R.string.language_default)); 
        
        super.loadUrl("file:///android_asset/www/rules.html?" 
        		    + color_schema + "&" + language);
    }

}
