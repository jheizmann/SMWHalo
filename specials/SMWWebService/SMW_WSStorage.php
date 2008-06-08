<?php
/*  Copyright 2008, ontoprise GmbH
*  This file is part of the halo-Extension.
*
*   The halo-Extension is free software; you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation; either version 3 of the License, or
*   (at your option) any later version.
*
*   The halo-Extension is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * This file provides the access to the database tables that are
 * used by the web service extension.
 * 
 * @author Thomas Schweitzer
 * 
 */

global $smwgHaloIP;
require_once $smwgHaloIP . '/includes/SMW_DBHelper.php';


//todo: add methods used in the wsstoragesql

/**
 * This class encapsulates all methods that care about the database tables of 
 * the web service extension. It is a singleton that contains an instance 
 * of the actual database access object e.g. the Mediawiki SQL database.
 *
 */
class WSStorage {

	//--- Private fields---
	
	private static $mInstance; // WSStorage: the only instance of this singleton
	private static $mDatabase; // The actual database object
	
	//--- Constructor ---
	
	/**
	 * Constructor.
	 * Creates the object that handles the concrete database access.
	 *
	 */
	private function __construct() {
        global $smwgHaloIP;
        if (self::$mDatabase == NULL) {
            global $smwgDefaultStore;
            switch ($smwgDefaultStore) {
                case (SMW_STORE_TESTING):
                    trigger_error('Testing store not implemented for HALO extension.');
                	break;
                case (SMW_STORE_MWDB): 
                default:
                    require_once($smwgHaloIP . '/specials/SMWWebService/storage/SMW_WSStorageSQL.php');
                    self::$mDatabase = new WSStorageSQL();
                break;
            }
        }
		
	}
	
	//--- Public methods ---
	
	/**
	 * Returns the single instance of this class.
	 *
	 * @return WSStorage
	 * 		The single instance of this class.
	 */
	public static function getInstance() {
        if (!isset(self::$mInstance)) {
            $c = __CLASS__;
            self::$mInstance = new $c;
        }

        return self::$mInstance;
	}
	
	/**
	 * Returns the actual database. 
	 *
	 * @return object
	 * 		The object to access the database.
	 */
	public static function getDatabase() {
        self::getInstance(); // Make sure, singleton is initialized
        return self::$mDatabase;
	}
	 
}
?>