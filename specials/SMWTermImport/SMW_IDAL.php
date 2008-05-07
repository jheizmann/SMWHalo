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
 * Interface of the Data Access Layer (DAL) that is part of the term import feature.
 * The DAL access a data source and creates terms in an XML format. These are 
 * returned to a module of the Transport layer.
 * 
 * @author Thomas Schweitzer
 */

interface IDAL {
	
	/**
	 * Returns a specification of the data source.
	 * 
	 * @return string: 
	 *  	Returns an XML structure with an element named <DataSource>.
	 * 		This element contains a list of elements that specify the data source.
	 * 		The names of the elements will be displayed in the user interface 
	 * 		followed by an input field if the tag has the attribute "display".
	 *      An additional attribute can specify the type of the source. For
	 * 		instance, the GUI offers a "Browse" button if the type is "file".
	 *      The element can already contain data. In this case it is used as 
	 * 		default value for the input field. The user can/has to specify the 
	 *      values. These are inserted into the XML structure which is needed 
	 *      for subsequent actions.
	 * 		Examples:
	 *	    The data source is a file. The user has to enter its name.
	 *		<?xml version="1.0"?>
	 *		<DataSource xmlns=http://www.ontoprise.de/smwplus#">
	 *	    	<filename display="Filename:" type="file"></filename>
	 *		</DataSource>
	 * 
	 */
	public function getSourceSpecification();
     
	/**
	 * Returns a list of import sets and their description.
	 * 
	 * @param string $dataSourceSpec: 
	 * 		The XML structure from getSourceSpecification(), filled with the data
	 * 		the user entered. 
	 * @return string:
     * 		Returns a list of import sets and their description (for the user) 
     * 		that the module can extract from the data source. An import set is 
     * 		just a name for a set of terms that module can extract e.g. different
     * 		domains of knowledge like Biological terms, Chemical terms etc. 
     * 		Each XML element <importSet> has the mandatory elements <name> and 
     * 		<desc>. Arbitrary, module dependent elements can be added. 
     * 		Example:
     * 		<?xml version="1.0"?>
	 *		<ImportSets xmlns="http://www.ontoprise.de/smwplus#">
	 *		    <importSet>
	 *		        <name>Biological terms</name>
	 *     			 <desc>Import all terms from the biology domain.</desc>
	 * 			</importSet>
	 *		    <importSet>
	 *		        <name>Biological terms</name>
	 *		        <desc>mport all terms from the chemistry domain.</desc>
	 *		    </importSet>
	 *		</ImportSets>
	 *
	 */
	public function getImportSets($dataSourceSpec);
     
	/**
	 * Returns a list of properties and their description.
	 *          
	 * @param string $dataSourceSpec: 
	 * 		The XML structure from getSourceSpecification(), filled with the data
	 * 		the user entered.
     * @param string $importSet: 
     * 		One of the import sets that can be retrieved with getImportSet() or 
     * 		empty. The complete XML element <importSet> as specified above is 
     * 		passed as it may contain values besides <name> and <desc>.
     * @return string: 
     * 		Returns a list of properties and their description (for the user) 
     * 		that the module can extract from the data source for each term in the
     * 		specified import set.
     * 		Example:
     * 		<?xml version="1.0"?>
     *		<Properties xmlns="http://www.ontoprise.de/smwplus#">
     *		    <property>
     *		        <name>articleName</name>
     *		        <desc>An article with this name will be created for the term of the vocabulary.</desc>
     *		    </property>
     *		    <property>
     *		        <name>content</name>
     *		        <desc>The description of the term.</desc>
     *		    </property>
     *		    <property>
     *		        <name>author</name>
     *		        <desc>Name of the person who describe the term.</desc>
     *		    </property>
     *		</Properties>
	 * 
	 *
	 */
	public function getProperties($dataSourceSpec, $importSet);
	
	/**
	 * Returns a list of the names of all terms that match the input policy. 
	 *
	 * @param string $dataSourceSpec
	 * 		The XML structure from getSourceSpecification(), filled with the data 
	 * 		the user entered.
	 * @param string $importSet
	 * 		One of the <importSet>-elements from the XML structure from 
	 * 		getImportSets() or empty.
	 * @param string $inputPolicy
	 * 		The XML structure of the input policy as defined in importTerms().
	 * 
	 * @return string
	 * 		An XML structure that contains the names of all terms that match the
	 * 		input policy.
	 * 		Example:
	 *		<?xml version="1.0"?>
	 *		<terms xmlns="http://www.ontoprise.de/smwplus#">
	 *		    <articleName>Hydrogen</articleName>
	 *		    <articleName>Helium</articleName>
	 *		</terms>
	 * 
	 */
	public function getTermList($dataSourceSpec, $importSet, $inputPolicy);
	
	/**
	 * Generates the XML description of all terms in the data source that match 
	 * the input policy.
	 * @param string $dataSourceSpec
	 * 		The XML structure from getSourceSpecification, filled with the data 
	 * 		the user entered.
     * @param string $importSet
     * 		One of the <importSet>-elements from the XML structure from 
     * 		getImportSets() or empty.
     * @param string $inputPolicy
     * 		The XML structure of the input policy. It contains the specification
     * 		of the terms to import and their properties.
     * 
     * @return string
	 *		An XML structure that contains all requested terms together with 
	 * 		their properties. The XML of requested terms that could not be 
	 * 		retrieved contains an error message.
	 * 		Example: 
	 *		<?xml version="1.0"?>
	 *		<terms xmlns="http://www.ontoprise.de/smwplus#">
	 *		    <term>
	 *		        <articleName>Helium</articleName>
	 *		        <content>Helium is a gas under normal conditions.</content>
	 *		        <!--
	 *		        Additional properties with type "string" may be specified.
	 *		        -->
	 *		    </term>
	 *		    <term error="The term 'Hydrogen' could not be found.">
	 *		        <articleName>Hydrogen</articleName>
	 *		    </term>
	 *		</terms>
	 *
	 */
	public function getTerms($dataSourceSpec, $importSet, $inputPolicy);
	
}	                            
?>