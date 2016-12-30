<!-- This CSS package applies Google styling; it should always be included. -->
<link rel="stylesheet" href="https://ssl.gstatic.com/docs/script/css/add-ons.css">


<style>
  body {
    font-family: Arial, sans-serif;
  }
  
  #modalContainer {
    display: none;
  }
  
  #modal {
    background: #ffffff; 
    width: 400px; 
    height: 200px;
    position: absolute; 
    z-index: 9000;
    left: 50%; 
    top: 100px;
    margin-left: -200px;
    padding: 2em;
    border-radius: 4px;
    border: 1px solid gray;
  }

  #modalShade {
    width: 100%;
    height: 100%;
    z-index: 8999;
    padding: 0;
    margin: 0;
    background-color: black;
    opacity: .8;
    position: fixed;
    top: 0;
    left: 0;
    overflow: hidden;
  }
  
  .container {
    width: 800px;
    margin: 20px auto 0 auto;
    padding; 20px;
  }
  
  .pageHeader {
    background-color: #66b5ff;
    padding: .5em;
    color: #ffffff;
    font-size: 30px;
    margin: 0, 0, 20px, 0;
  }
  
  .headerImage {
    height: 40px; vertical-align: text-bottom;
  }
  
  .headerMsg {
    background-color: #f9edbe; border: 1px solid #f0c36d; padding: .25em; margin: 0;
  }
  
  .table {
    width: 100%; max-width: 100%; min-width: 100%; margin: 0; padding: 0;
  }
  
  .table, td {
    vertical-align: top;
  }
  
  .borderless {
    border: none;
  }
  
  .settingsNameCol {
    width: 40%; max-width: 40%; min-width: 40%; padding-right: 2em;
  }
  
  .settingsValueCol {
    width: 60%; max-width: 60%; min-width: 60%;
  }
  
  .settingTitle {
    font-weight: bold;
  }
  
  .alignRight {
    text-align: right;
  }
  
  .inputField {
    width: 100%;
  }
  
  .hidden {
    visibility: hidden;
  }
  
  .footer {
    position:absolute;
	bottom:0; /* stick to bottom */
    background-color: white;
    padding: 0;
  }

</style>