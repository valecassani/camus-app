package com.camusapp;

import com.facebook.react.ReactActivity;
import com.chirag.RNMail.RNMail;
import com.oblador.vectoricons.VectorIconsPackage;
import com.AirMaps.AirPackage;
import com.rota.rngmaps.RNGMapsPackage;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.github.xinthink.rnmk.ReactMaterialKitPackage;
import com.burnweb.rnsendintent.RNSendIntentPackage; 

import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "camusapp";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
        new RNMail(),
        new VectorIconsPackage(),
        new AirPackage(),
        new RNGMapsPackage(),
        new ReactMaterialKitPackage(),
        new RNSendIntentPackage()

        );
    }
}
