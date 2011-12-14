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

if ( isset( $_SERVER ) && array_key_exists( 'REQUEST_METHOD', $_SERVER ) ) {
	die( "This script must be run from the command line\n" );
}

/**
 * @file
 * @ingroup LinkedData_Tests
 */

/**
 * Test suite for handling non-existing pages. The tests requires that the
 * triple store is running. The following data is loaded:
 * /SMWTripleStore/resources/lod_wiki_tests/OntologyBrowserSparql/PersonGraph.n3
 *
 * @author thsc
 *
 */
class TestNonExistinPageSuite extends PHPUnit_Framework_TestSuite
{

	public static $mOrderOfArticleCreation;
	public static $mArticles;

	protected $mPersonGraph = "http://www.example.org/smw-lde/smwGraphs/PersonGraph";
	protected $mFilePath = "file://resources/lod_wiki_tests/OntologyBrowserSparql/";

	public static function suite() {

		$suite = new TestNonExistinPageSuite();
		$suite->addTestSuite('TestNonExistingPageHandler');
		return $suite;
	}

	protected function setUp() {
		// set variables for the non-existing page handler
		global $smwgHaloNEPEnabled, $smwgHaloNEPGenericTemplate, $smwgHaloNEPPropertyPageTemplate,
		$smwgHaloNEPCategoryPageTemplate, $smwgHaloNEPUseGenericTemplateIfCategoryMember,
		$smwgHaloNEPCategoryTemplatePattern, $smwgHaloTripleStoreGraph;

		# boolean - Set this variable to <true> to enable non-existing page handling.
		$smwgHaloNEPEnabled = true;

		# string - Article name of the generic template for all non-existing pages but
		# properties and categories.
		$smwgHaloNEPGenericTemplate = "MediaWiki:NEP/Generic";

		# string - Article name of the template for property pages
		$smwgHaloNEPPropertyPageTemplate = "MediaWiki:NEP/Property";

		# string - Article name of the template for category pages
		$smwgHaloNEPCategoryPageTemplate = "MediaWiki:NEP/Category";

		# boolean - If <true>, the generic NEP template is used, even if the Linked Data
		# item has a type.
		$smwgHaloNEPUseGenericTemplateIfCategoryMember = true;

		# string - The Linked Data item can have several types which are mapped to wiki
		# categories. A template can be used for each category according to the template
		# pattern. The variable {cat} is replaced by the category that is associated with
		# a type.
		$smwgHaloNEPCategoryTemplatePattern = "MediaWiki:NEP/Category/{cat}";


		// Create articles
		$this->initArticleContent();
		$this->createArticles();

		$commands = array();
		$commands[] = $this->dropGraph($this->mPersonGraph);
		$commands[] = $this->createGraph($this->mPersonGraph);
		$commands[] = $this->loadFileIntoGraph("{$this->mFilePath}PersonGraph.n3", $smwgHaloTripleStoreGraph, "n3");
		$success = $this->flushCommands($commands);
			
	}

	private function createGraph($uri) {
		return "CREATE SILENT GRAPH <$uri>\n";
	}

	public function loadFileIntoGraph($file, $graph, $format) {
		return  "LOAD <$file?format=$format> INTO <$graph>\n";
	}

	public function flushCommands($commands) {
		try {
			$con = TSConnection::getConnector();
			$con->connect();
			$status = $con->update(null, $commands);
			$con->disconnect();
			return true;
		} catch (Exception $e) {
			return false;
		}
	}

	protected function tearDown() {
		$this->removeArticles();
		$this->dropGraph($this->mPersonGraph);
	}

	protected function dropGraph($uri) {
		return "DROP SILENT GRAPH <$uri>\n";
	}


	//--- Private functions --------------------------------------------------------

	private function createArticles() {
		global $wgUser;
		$wgUser = User::newFromName("WikiSysop");
			
		$file = __FILE__;
		try {
			foreach (self::$mOrderOfArticleCreation as $title) {
				self::createArticle($title, self::$mArticles[$title]);
			}
		} catch (Exception $e) {
			$this->assertTrue(false, "Unexpected exception while testing ".basename($file)."::createArticles():".$e->getMessage());
		}
			
	}

	private function createArticle($title, $content) {

		$title = Title::newFromText($title);
		$article = new Article($title);
		// Set the article's content
		$success = $article->doEdit($content, 'Created for test case',
		$article->exists() ? EDIT_UPDATE : EDIT_NEW);
		if (!$success) {
			echo "Creating article ".$title->getFullText()." failed\n";
		}
	}

	private function removeArticles() {

		foreach (self::$mOrderOfArticleCreation as $a) {
			global $wgTitle;
			$wgTitle = $t = Title::newFromText($a);
			$article = new Article($t);
			$article->doDelete("Testing");
		}

	}

	private function initArticleContent() {
		self::$mOrderOfArticleCreation = array(
			'MediaWiki:NEP/Generic',
			'MediaWiki:NEP/Property',
			'MediaWiki:NEP/Category',
			'MediaWiki:NEP/Category/Person',
			'MediaWiki:NEP/Category/Man',
			'MediaWiki:NEP/Category/Woman'
			);

			self::$mArticles = array(
			//------------------------------------------------------------------------------
			'MediaWiki:NEP/Generic' =>
<<<LODNEP

----

Known facts about ''\$uri$'' stored in the underlying knowledge-base.

This URI is mapped to: \$name$

===Properties of '''\$name$'''===
'''\$name$''' has the following properties:

{{#sparql:
 SELECT ?P ?O
 WHERE {
     GRAPH ?G {
         <\$uri$> ?P ?O .
     }
 }
 | format=table
 | merge=false
 }}

===References to '''\$name$'''===

Other objects that refer to '''\$name$''' in the underlying knowledge-base:

{{#sparql:
 SELECT *
 WHERE {
     GRAPH ?G {
         ?S ?P <\$uri$> .
     }
 }
 | format=table
 }}
 
===Types of '''\$name$'''===
 
'''\$name$''' has the following type(s):

{{#sparql:
  SELECT ?Type
  WHERE {
    GRAPH ?G {
	<\$uri$> rdf:type ?Type .
    }
 }
 | format=table
 | merge=false
}}
LODNEP
			,
			//------------------------------------------------------------------------------
			'MediaWiki:NEP/Property' =>
<<<LODNEP

----

===Domain categories of {{PAGENAME}}===

{{#sparql:
SELECT  ?cat
WHERE { 
  GRAPH ?g {
    ?s prop:\$name$ ?o .
    ?s rdf:type ?cat .
  }
}
|format=table
}}


===Range categories of {{PAGENAME}}===
{{#sparql:
SELECT  ?cat
WHERE { 
  GRAPH ?g {
    ?s prop:\$name$ ?o .
    ?o rdf:type ?cat .
  }
}
|format=table
}}

===Usage of property {{PAGENAME}}===

{{#sparql:
SELECT  ?s ?o
WHERE { 
  GRAPH ?g {
    ?s prop:\$name$ ?o .
  }
}
|format=table
}}
LODNEP
			,
			//------------------------------------------------------------------------------
			'MediaWiki:NEP/Category' =>
<<<LODNEP

----
===Instance of category {{PAGENAME}}===

{{#sparql:
SELECT  ?s
WHERE { 
  GRAPH ?g {
    ?s rdf:type cat:\$name$ .
  }
}
|format=table
}}


===Super categories of {{PAGENAME}}===

{{#sparql:
SELECT ?cat
WHERE { 
  GRAPH ?g {
    cat:\$name$ rdfs:subClassOf ?cat.
  }
}
|format=table
}}


===Sub-categories of {{PAGENAME}}===

{{#sparql:
SELECT ?cat
WHERE { 
  GRAPH ?g {
    ?cat rdfs:subClassOf cat:\$name$ .
  }
}
|format=table
}}

===Properties of category {{PAGENAME}}===

{{#sparql:
SELECT  ?p
WHERE { 
  GRAPH ?g {
    ?s rdf:type cat:\$name$ .
    ?s ?p ?o .
  }
}
|format=table
}}

===Properties that refer to category {{PAGENAME}}===

{{#sparql:
SELECT ?p
WHERE { 
  GRAPH ?g {
    ?o rdf:type cat:\$name$ .
    ?s ?p ?o .
  }
}
|format=table
}}

LODNEP
			,

			//------------------------------------------------------------------------------
			'MediaWiki:NEP/Category/Person' =>
<<<LODNEP

----

This item is a '''Person'''.
LODNEP
			,
			//------------------------------------------------------------------------------
			'MediaWiki:NEP/Category/Man' =>
<<<LODNEP

----

This item is a '''Man'''.
LODNEP
			,
			//------------------------------------------------------------------------------
			'MediaWiki:NEP/Category/Woman' =>
<<<LODNEP

----

This item is a '''Woman'''.
LODNEP
			);
	}



}



/**
 * This class tests the handler for non existing pages.
 * See feature: http://dmwiki.ontoprise.com:8888/dmwiki/index.php/Non-exisiting_pages_handler
 *
 * @author thsc
 *
 */
class TestNonExistingPageHandler extends PHPUnit_Framework_TestCase {

	protected $backupGlobals = FALSE;

	function setUp() {
	}

	function tearDown() {
	}

	/**
	 * Checks if the hook for editing non-existing pages is installed
	 */
	function testCheckEditFormPreloadTextHook() {
		global $wgHooks;
			
		$this->assertArrayHasKey('EditFormPreloadText', $wgHooks);
			
		$this->assertContains('TSCNonExistingPageHandler::onEditFormPreloadText',
		$wgHooks['EditFormPreloadText']);
	}

	/**
	 * Checks if the class for handling non-existing pages is present
	 */
	function testCheckPageHandlerExists() {

		$ph = new TSCNonExistingPageHandler();
		$this->assertNotNull($ph);
	}

	/**
	 * Retrieves the content of the non-existing article in view mode and
	 * verifies its completeness.
	 */
	function testGetNonExistingArticle() {
		$this->checkNonExistingArticles("Peter", array(
				"MediaWiki:NEP/Category/Man",
				"MediaWiki:NEP/Category/Person",
				"MediaWiki:NEP/Generic",
		));
		$this->checkNonExistingArticles("Mary", array(
				"MediaWiki:NEP/Category/Woman",
				"MediaWiki:NEP/Generic",
		));
		$this->checkNonExistingArticles("Category:Person", array(
				"MediaWiki:NEP/Category"
				));
				$this->checkNonExistingArticles("Property:FatherOf", array(
				"MediaWiki:NEP/Property"
				));
	}


	//--- Private functions --------

	/**
	 * Checks the content of the article with the name $articleName in view- and
	 * in edit mode.
	 *
	 * @param string $articleName
	 * 		Name of the article
	 * @param array $expectedContent
	 * 		Names of the template articles that must be contained in the generated
	 * 		content.
	 */
	private function checkNonExistingArticles($articleName, array $expectedContent) {
		global $wgRequest;
			
		global $mediaWiki;
		$mediaWiki = new MediaWiki();
			
		// Check article in view mode
		$wgRequest->setVal('action', 'view');
		$wgRequest->setVal('title', $articleName);
		$this->verifyContent($articleName, "view", $expectedContent);

		// Check article in edit mode with redlink
		$wgRequest->setVal('action', 'edit');
		$wgRequest->setVal('redlink', '1');
		$this->verifyContent($articleName, "view", $expectedContent);

		// Check article in edit mode
		$wgRequest->setVal('action', 'edit');
		$wgRequest->setVal('redlink', null);
		$wgRequest->setVal('preloadNEP', 'true');
		$this->verifyContent($articleName, "edit", $expectedContent);

		$wgRequest->setVal('preloadNEP', null);
		$wgRequest->setVal('action', null);
		$wgRequest->setVal('title', null);

	}

	private function verifyContent($articleName, $mode, array $expectedContent) {
			
		$uri = TSHelper::getUriFromTitle(Title::newFromText($articleName));
		$t = Title::newFromText($articleName);
			
		// generate the text for the non-existing page
		$text = "Foo";
		switch ($mode) {
			case 'view':
				$a = MediaWiki::articleFromTitle($t);
				// Article must be of type TSCNonExistingPage
				$this->assertTrue($a instanceof TSCNonExistingPage,
    					"Article $articleName is not an instance of TSCNonExistingPage.");
				$text = $a->getContent();
				break;
			case 'edit':
				$ph = new TSCNonExistingPageHandler();
				$ph->onEditFormPreloadText($text, $t);
				break;
		}
		// remove whitespaces for comparison
		$text = trim(preg_replace("/\s+/", " ", $text));
			
		// verify that the text contains the expected content
		$articles = TestNonExistinPageSuite::$mArticles;
		foreach ($expectedContent as $ep) {
			$ac = $articles[$ep];
			// remove whitespaces
			$ac = preg_replace("/\s+/", " ", $ac);
			$ac = trim(str_replace('$name$', $t->getText(), str_replace('$uri$', $uri, $ac)));
			$this->assertTrue(strpos($text, $ac) !== false, "Text for template <$ep> not found in article $articleName. Mode = $mode" );
		}
			
		if ($mode == "view") {
			$link = trim(wfMsg('lod_nep_link', $articleName));
			$this->assertTrue(strpos($text, $link) !== false, "Link not found" );
		}
	}

}
