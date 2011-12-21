<?php
/*
 * Copyright (C) Vulcan Inc.
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program.If not, see <http://www.gnu.org/licenses/>.
 *
 */

/**
 * @file
 * @ingroup LinkedDataStorage
 */
/**
 * This file initializes and deletes all MySQL database tables and
 * triple store content that is used by the Linked Data Extension.
 *
 * @author Thomas Schweitzer
 *
 */

global $tscgIP;
require_once $tscgIP . '/includes/TSC_DBHelper.php';

/**
 * This class encapsulates methods that care about the database tables and
 * triple store graphs of the LinkedData extension.
 *
 * @author Thomas Schweiter
 *
 */
class TSCStorageSQL {

	const TRIPLE_PERSISTENCE_TABLE	= "lod_triple_persistence";


	/**
	 * Initializes the database tables of the Linked Data extensions.
	 * These are:
	 * - TSC_triple_persistence
	 *
	 * The table TSC_mapping_persistence which was used in older
	 * versions of the Linked Data extension will be deleted.
	 *
	 */
	public function initDatabaseTables() {

		$db =& wfGetDB( DB_MASTER );

		$verbose = true;
		TSCDBHelper::reportProgress("Setting up TSC tables ...\n",$verbose);



			
		// TSC_triple_persistence
		//		persistence of triples in the triple store
		$table = $db->tableName(self::TRIPLE_PERSISTENCE_TABLE);
		TSCDBHelper::setupTable($table, array(
				'triple_set_id'	=> 'VARCHAR(64) CHARACTER SET utf8 COLLATE utf8_bin',
	            'component'		=> 'VARCHAR(64) CHARACTER SET utf8 COLLATE utf8_bin',
	            'triples' 		=> 'Text CHARACTER SET utf8 COLLATE utf8_bin'),
		$db, $verbose);
			

		TSCDBHelper::reportProgress("   ... done!\n",$verbose);

		print "   ... done!\n";

		return true;

	}

	/**
	 * Drops all database tables of the LinkedData Extension.
	 */
	public function dropDatabaseTables() {
        global $smwgHaloWebserviceEndpoint;
        
		if (isset($smwgHaloWebserviceEndpoint)) {
			print("Deleting source definitions...");
			TSCAdministrationStore::getInstance()->deleteAllSourceDefinitions();
			print("done.\n");
		}

		print("Deleting all database content and tables generated by the Linked Data Extension ...\n\n");
		$db =& wfGetDB( DB_MASTER );
		$tables = array(

		self::TRIPLE_PERSISTENCE_TABLE
		);
		foreach ($tables as $table) {
			$name = $db->tableName($table);
			$db->query('DROP TABLE' . ($wgDBtype=='postgres'?'':' IF EXISTS'). $name, 'TSCStorageSQL::dropDatabaseTables');
			TSCDBHelper::reportProgress(" ... dropped table $name.\n", $verbose);
		}

		print("All data removed successfully.\n");
	}


	/*
	 * Functions for the persistency layer of the triple store.
	 *
	 */

	/**
	 * Persists all triples given in $trig for the component $component with the
	 * ID $tripleSetID.
	 * Several triple sets can be added using the same component and ID.
	 *
	 * @param string $component
	 * 		Name of a component
	 * @param string $tripleSetID
	 * 		ID of a triple set. The ID is local to the component i.e. other
	 * 		components may use the same ID. Yet the pair <component, ID> can
	 * 		still be distinguished.
	 * @param string $trig
	 * 		Triples in TriG format.
	 *
	 * @return bool success
	 * 		<true>, if the operation was successful,
	 * 		<false> otherwise
	 */
	public function persistTriples($component, $tripleSetID, $trig) {
		$db = & wfGetDB( DB_MASTER );
		$t = $db->tableName(self::TRIPLE_PERSISTENCE_TABLE);

		$setValues = array(
            'component'     => $component,
            'triple_set_id' => $tripleSetID,
            'triples'	    => $trig);

		return $db->insert($t, $setValues);
	}

	/**
	 * Deletes all persistent triples of the component $component with the
	 * ID $id.
	 * @param string $component
	 * 		Component to which the triples belong
	 * @param string $id
	 * 		ID with respect to the component. If the ID is <null>, all triples
	 * 		of the component are deleted.
	 */
	public function deletePersistentTriples($component, $id = null) {
		$db = & wfGetDB( DB_MASTER );
		$t = $db->tableName(self::TRIPLE_PERSISTENCE_TABLE);

		$condition = array("component" => $component);
		if (!is_null($id)) {
			$condition["triple_set_id"] = $id;
		}
		$db->delete($t, $condition);
	}

	/**
	 * Reads the triples of the $component with the $tripleSetID from the database
	 * and returns them in TriG format. Several TriG serialization may be returned.
	 *
	 * @param string $component
	 * 		Name of a component
	 * @param string $tripleSetID
	 * 		ID of a triple set. The ID is local to the component i.e. other
	 * 		components may use the same ID. Yet the pair <component, ID> can
	 * 		still be distinguished. If this parameter is <null>, all triples of
	 * 		the $component are read.
	 * @return array<string> $trig
	 * 		TriG serializations of the triples.
	 */
	public function readPersistentTriples($component, $tripleSetID) {
		$db = & wfGetDB( DB_SLAVE );

		$cond = array("component" => $component);
		if (!is_null($tripleSetID)) {
			$cond["triple_set_id"] = $tripleSetID;
		}
		$res = $db->select($db->tableName(self::TRIPLE_PERSISTENCE_TABLE),
		array("triples"), $cond);
			
		$trig = array();
		while ($row = $db->fetchObject($res)) {
			$trig[] = $row->triples;
		}
		$db->freeResult($res);
			
		return $trig;
	}

	/**
	 * Deletes the complete content of table TRIPLE_PERSISTENCE_TABLE
	 */
	public function deleteAllPersistentTriples() {
		$db = & wfGetDB( DB_MASTER );
		$db->delete($db->tableName(self::TRIPLE_PERSISTENCE_TABLE), "*");

	}


}
