<?php
    
    class CloudStack {
        protected $_endpoint = 'http://cloud.yourhead.com/stack/';
        protected $_cacheExt = 'cache';
        const     _cacheDir  = 'cloud_cache';
        
        protected $_cachePath = null;
        
        protected $_contentURLString;
        protected $_userId;
        protected $_siteId;
        protected $_stackId;
        
        public function __construct ($contentURLString, $cacheDir=null) {
            if (!$contentURLString) {
                error_log ("No URL provided");;
                return;
            }
            
            if ($cacheDir)
                $this->_cacheDir = $cacheDir;
            
            $this->_contentURLString = $contentURLString;
            $path = parse_url ($contentURLString, PHP_URL_PATH);
            if (!$path) {
                error_log ("Malformed URL");
                return;
            }
            
            $comps = explode ('/', $path);
            if (!$comps || (count($comps) < 5)) {
                error_log ("Malformed path");;
                return;
            }
            
            $this->_userId = $comps[2];
            $this->_siteId = $comps[3];
            $this->_stackId = $comps[4];
            Valid::objectId ($this->_userId);
            Valid::objectId ($this->_siteId);
            Valid::objectId ($this->_stackId);
        }
        
        // echo the content of this stack
        public function render () {
            echo $this->fetch ();
        }
        
        // remove a cache for this stack
        public function cacheClear () {
            $cachePath = $this->cachePath ();
            if (!isset($cachePath)) return;
            unlink ($cachePath);
        }
        
        // returns the path to the cache file
        protected function cachePath () {
            if (!$this->_cachePath) {
                $this->_cachePath = self::cacheDirPath() . "/" . $this->_stackId . "." . $this->_cacheExt;
            }
            return $this->_cachePath;
        }
        
        // test for the existance of a cache for this stack
        public static function cacheDirPath () {
            return dirname(__FILE__) . "/" . self::_cacheDir;
        }
        
        // test for the existance of a cache for this stack
        public static function cacheDirExists () {
            return is_dir(self::cacheDirPath());
        }
        
        // create a new cache directory if one doesn't already exist
        public static function cacheDirCreate () {
            if (self::cacheDirExists()) return;
            mkdir (self::cacheDirPath());
        }
        
        // remove all files from the cache directory
        public static function cacheDirClear () {
            if (!self::cacheDirExists()) return self::cacheDirCreate();
            $files = scandir(self::cacheDirPath());
            foreach ($files as $file) {
                $f = self::cacheDirPath() . "/" . $file;
                if (is_file($f) && is_writable($f)) unlink($f);
            }
        }
        
        // test for the existance of a cache for this stack
        public function cacheExists () {
            $cachePath = $this->cachePath ();
            if (!isset($cachePath)) return NO;
            return file_exists ($cachePath);
        }
        
        // return the contents of the cache for this stack
        protected function cacheFetch () {
            return file_get_contents($this->cachePath ());
        }
        
        // if this host allows curl, use that first
        protected function curlFetch ($url) {
            if (!function_exists('curl_version'))
                return null;
            
            set_time_limit(120);
            $c = curl_init ();
            if (!$c) return nil;
            curl_setopt ($c, CURLOPT_URL, $url);
            curl_setopt ($c, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt ($c, CURLOPT_FAILONERROR, 1);
            curl_setopt ($c, CURLOPT_CONNECTTIMEOUT, 5);
            curl_setopt ($c, CURLOPT_MAXREDIRS, 2);
            curl_setopt ($c, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; pl; rv:1.9) Gecko/2008052906 Firefox/3.0" );
            curl_setopt ($c, CURLOPT_AUTOREFERER, true );
            curl_setopt ($c, CURLOPT_FOLLOWLOCATION, true );
            curl_setopt ($c, CURLOPT_TIMEOUT, 10);
            curl_setopt( $c, CURLOPT_VERBOSE, FALSE);
            curl_setopt( $c, CURLOPT_DNS_USE_GLOBAL_CACHE, FALSE);
            curl_setopt( $c, CURLOPT_DNS_CACHE_TIMEOUT, 120);
            curl_setopt( $c, CURLOPT_FORBID_REUSE, 1);
            curl_setopt( $c, CURLOPT_FRESH_CONNECT, 1);
            curl_setopt( $c, CURLOPT_FOLLOWLOCATION, true);
            $response = curl_exec ($c);
            curl_close ($c);
            set_time_limit(ini_get('max_execution_time'));
            return $response;
        }
        
        // if there's no curl, try a get contents
        protected function fileGetFetch ($url) {
            if (!function_exists('file_get_contents'))
                return null;
            
            return file_get_contents ($url);
        }
        
        // fetch content from stacks cloud and cache
        protected function cloudFetch () {
            $content = $this->curlFetch ($this->_contentURLString);
            if (empty ($content))
                $content = $this->fileGetFetch ($this->_contentURLString);
            
            
            if (!empty ($content)) {
                self::cacheDirCreate();
                file_put_contents ($this->cachePath (), $content);
            }
            
            return $content;
        }
        
        // fetch content
        public function fetch () {
            $content = null;
            if ($this->cacheExists())
                $content = $this->cacheFetch ();
            if (!$content)
                $content = $this->cloudFetch ();
            if (!$content)
                return null;
            return json_decode($content);
        }
        
    }
    
    
    class CloudImage extends CloudStack{
        
        public function __construct ($contentURLString, $extension, $cacheDir=null) {
            if (!$extension) {
                error_log ("No extension provided");
                return;
            }
            $this->_cacheExt = $extension;
            parent::__construct ($contentURLString, $cacheDir);
        }
        
        // fetch the dynamic url from stacks cloud, then fetch the image
        protected function cloudFetch () {
            $jsonString = $this->curlFetch ($this->_contentURLString);
            if (empty ($jsonString))
                $jsonString = $this->fileGetFetch ($this->_contentURLString);
            if (empty ($jsonString)) return;
            
            $json = json_decode ($jsonString);
            if (empty ($json)) return;
            
            $url = $json->file->url;
            if (empty ($url)) return;
            
            $content = $this->curlFetch ($url);
            if (empty ($content))
                $content = $this->fileGetFetch ($url);
            if (empty ($content)) return;
            
            self::cacheDirCreate();
            file_put_contents ($this->cachePath (), $content);
        }
        
        // cache content if necessary
        public function fetch () {
            if ($this->cacheExists ()) return;
            $this->cloudFetch ();
        }
    }
    
    
    class Valid {
        
        // basic string validation
        private static function _string ($string, $min, $max, $e) {
            if (!isset($string))                     throw new Exception ($e . "Empty.");
            if (!is_string($string))                 throw new Exception ($e . "Not a string.");
            if (strlen($string) < $min)              throw new Exception ($e . "Too short: $string");
            if (strlen($string) > $max)              throw new Exception ($e . "Too long: $string.");
        }
        
        // validate for fundamental object id characteristics
        public static function objectId ($objectId) {
            $e = "Invalid ID. ";
            Valid::_string($objectId, 8, 32, $e);
        }
        
    }
    
    
    // route operations
    if ((isset($_GET['userId'])) && (isset($_GET['siteId'])) && (isset($_GET['op']))) {
        
        $op = $_GET['op'];
        $userId = $_GET['userId'];
        $siteId = $_GET['siteId'];
        Valid::objectId ($userId);
        Valid::objectId ($siteId);
        
        if ($op === 'clear') {
            $stackId = $_GET['stackId'];
            Valid::objectId ($stackId);
            $url = 'http://cloud.yourhead.com/stack/' . $userId . '/' . $siteId . '/' . $stackId . '/preview';
            $stack = new CloudStack($url);
            $stack->cacheClear ();
            echo "OK";
        } else if ($_GET['op'] === 'ping') {
            echo "OK";
        } else if ($_GET['op'] === 'flush') {
            $userId = $_GET['userId'];
            $siteId = $_GET['siteId'];
            Valid::objectId ($userId);
            Valid::objectId ($siteId);
            CloudStack::cacheDirClear ();
            echo "OK";
        } else {
            echo "ERROR";
        }
        
    }
    
    ?>