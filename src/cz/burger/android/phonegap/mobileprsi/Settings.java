package cz.burger.android.phonegap.mobileprsi;

import android.os.Bundle;
import android.preference.PreferenceActivity;
import android.widget.Toast;

public class Settings extends PreferenceActivity {
	
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		addPreferencesFromResource(R.xml.preferences);
	}
	
	@Override
	public void onBackPressed() {
		
		Toast.makeText(getApplicationContext(), 
				getString(R.string.settings_back), 
				Toast.LENGTH_SHORT).show();
		
		super.onBackPressed();
	}

}
