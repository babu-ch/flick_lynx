
## web demo

https://babu-ch.github.io/flick_lynx/

## Lynx Explorer demo (the "h" is intentionally removed to prevent accidental clicks)  
Enter the following URL into Lynx Explorer to run it  

ttps://babu-ch.github.io/flick_lynx/main.lynx.bundle


## dir

```
.
├── docs               # for publishing on GitHub Pages  
├── flick_lynx_android # for Android  
├── flick_lynx_main    # main source  
└── flick_lynx_web     # for web  
```

## build

```sh
cd flick_lynx_main
npm run build

# web
cd ../flick_lynx_web
npm run build

# android 
cd ../flick_lynx_android
cp ../flick_lynx_main/dist/main.lynx.bundle ./app/src/main/assets/
```
