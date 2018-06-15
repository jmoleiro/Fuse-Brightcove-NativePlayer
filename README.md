# Native Fuse Open Brightcove Player, with DoubleClick Video Ads

It's a native implementation of BrightCove Video Player, and Preroll DoubleClick Video Ads (With skip support).

This is a initial approach and some things needs to be improved or refactored, but this initial release play videos and Ads.

### Usage
1) Copy the folders *BCPlayer* and *components* into your project folder
2) Modify the .unoproj file and add the line `"**.js:Bundle"` into the `Includes` section
    ```json
      "Includes": [
        "**.js:Bundle",
        "*"
      ],
    ```
3) To use the player on your code, use this code
    ```xml
    <BrightCoveVideo Dock="Fill" adPlay="0" accountID="Your Brightcove Account ID" videoID="A Brightcove Video ID" Alignment="Default" />
    ```
4) To use the player with Ads, use this code instead
    ```xml
    <BrightCoveVideoAd Dock="Fill" adPlay="0" accountID="Your Brightcove Account ID" videoID="A Brightcove Video ID" Alignment="Default" />
    ```

### Configuration

The Player configuration is handled by the config.json file
```javascript
module.exports = {
    ad_url: '{The Google Tag for you Video Ad Unit}',
    base_url: "http://app.mydomain.com/video/",
    app_name: "My%20App",
    skip_ad_label: 'Skip Ad',
    bc_client_id: "{Your Brightcove API Client ID}",
    bc_client_secret: "{Your Brightcove API Client Secret}"
}
```

- The `ad_url` parameter is the Google Tag generated for your Video Ad Unit. Please read the [DoubleClick Documentation](https://support.google.com/dfp_premium/answer/1181016?hl=en) to know how to generate this Tag.
- The `base_url` is the base url that is send back to DoubleClick as url referer for the Video Ad Display. The Url send is base_url + Video ID
- The `app_name` is the name that is send back to DoubleClick as a description url for the Video Ad Display. The Url send is app_name + Video ID
- The `skip_ad_label` is the label for the Skip Ad Button
- The `bc_client_id` is your Brightcove API Client ID
- The `bc_client_secret` is your Brightcove API Client Secret

To generate your BrighCove API Client ID/Secret, please [read the BrighCove documentation about this subject](https://support.brightcove.com/managing-api-authentication-credentials).

### Notes

- The Video ID must be from your own Brightcove Account ID
- The Video Ad Click/Tap is not working properly right now
- The Ad Code uses the current VAST 3.0 code and should work with any VAST 3.0 compliant Ad Server, but it's only tested with Brightcove
- Only Pre-roll Ads are displayed. No support for Mid-roll, and Post-roll, and neither for Non-linear banner ads. It should need fixes on the VAST Ad Parsing code
- We tested Ads with only one video creativity. Further tests are need for multiple ads


