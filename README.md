# easy-login-for-interactive-brokers

This chrome extension contains a neural network trained to recognise digits that appear when users log into their Interactive Brokers account. It automatically fetches the corresponding codes from your security card, saving you from having to find your security card and extract the codes yourself.  

It works on two urls: 
- Web trader: https://zh.wgw.interactivebrokers.com/webtrader/servlet/login 
- Account management: https://www.interactivebrokers.com.hk/sso/Login  

Usage: 
1) Click on the "Card" button on the extension to fill out your card details (the next update will include a feature that automatically fills out the details from images of your card) 
2) Login to either web trader or account management at Interactive Brokers 
3) When the index number image appears, click "Run" on the extension. The extension will only work when you visit the two urls stated above - otherwise the status will be stated as "Inactive" and you won't be able to run the extension. The digits and codes will then appear on the pop-up of the extension  

The entire process is run locally i.e. the neural network is embedded into the extension itself and not hosted on a server somewhere. The card details will be saved in the chrome local storage and can't be accessed by anyone else. 

NOTE: w.json (the weights for the NN) in ./scripts/json/ is too large (>25mb) to be uploaded here. b.json (bias parameters) are included. 

Download extension here: https://chrome.google.com/webstore/detail/gchmadocpomnpglpannjoliodjahldlj/publish-accepted?hl=en-US
