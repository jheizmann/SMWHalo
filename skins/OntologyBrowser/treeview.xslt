<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<!--
		** ** Description : STYLESHEET FOR GENERATION OF THE HTML Treeview **
		** Date : 05/08/2003 - version : 1.3 ** Author : Jean-Michel Garnier,
		http://rollerjm.free.fr ** Source is free but feel free (!) to send
		any comment / suggestion to garnierjm@ifrance.com ** Updates : ** -
		07/01/2003 : add img-directory parameter ** - 18/01/2003 : remove
		deploy-treeview parameter, add XSLT param-isMozilla, refactoring bc of
		DTD changes ** - 05/08/2003 : fix bug when using the expanded
		parameter **
	-->
	<!-- Change the encoding here if you need it, i.e. UTF-8 -->
	<xsl:output method="html" encoding="iso-8859-1" indent="yes" />
	<!--
		************************************ Parameters
		************************************
	-->
	<!--
		deploy-treeview, boolean - true if you want to deploy the tree-view at
		the first print
	-->
	<xsl:param name="param-deploy-treeview" select="'false'" />
	<!--
		is the client Netscape / Mozilla or Internet Explorer. Thanks to Bill,
		90% of sheeps use Internet Explorer so it will the default value
	-->
	<xsl:param name="param-is-netscape" select="'false'" />
	<!-- hozizontale distance in pixels between a folder and its leaves -->
	<xsl:param name="param-shift-width" select="15" />
	<xsl:param name="startDepth" select="1" />

	<!-- Maximum length of entites displayed -->
	<xsl:param name="maximumEntityLength" select="18" />

	<!-- image source directory-->
	<xsl:param name="param-img-directory" select="''" />
	<xsl:param name="param-wiki-path" select="''" />
	<xsl:param name="param-ns-concept" select="''" />
	<xsl:param name="param-ns-property" select="''" />
	<!--
		************************************ Variables
		************************************
	-->
	<xsl:variable name="var-nonbreakspace">&#160;</xsl:variable>
	<xsl:variable name="var-simple-quote">'</xsl:variable>
	<xsl:variable name="var-slash-quote">\'</xsl:variable>
	<xsl:variable name="var-backslash">\</xsl:variable>
    <xsl:variable name="var-backslash-quote">\\</xsl:variable>
	<xsl:variable name="var-underscore">_</xsl:variable>
	<xsl:variable name="var-blank" select="string(' ')"></xsl:variable>
	<!--
		** ** Model "treeview" ** ** This model transforms an XML treeview
		into an html treeview **
	-->
	<xsl:template match="errorMessage">
	   <br/>ErrorCode: <xsl:value-of select="errorCode"/>
	   <br/>ErrorMessage: <xsl:value-of select="errorMessage"/>
	</xsl:template>
	
	<xsl:template match="result">
		<xsl:choose>
			<xsl:when test="not (@isEmpty)">
				<!-- -->
				<!--<link rel="stylesheet" href="treeview.css" type="text/css"/>-->
				<!-- Warning, if you use-->
				<!--
					<script src="treeview.js" language="javascript"
					type="text/javascript"/>
				-->

				<!--
					Apply the template folder starting with a startDepth in the tree of
					1
				-->

				<xsl:apply-templates select="conceptTreeElement">
					<xsl:with-param name="rek_depth" select="1" />
				</xsl:apply-templates>

				<xsl:apply-templates select="propertyTreeElement">
					<xsl:with-param name="rek_depth" select="1" />
				</xsl:apply-templates>

				<xsl:apply-templates select="categoryPartition" />
				<xsl:apply-templates select="propertyPartition" />
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="@textToDisplay"></xsl:value-of>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<!--
		** ** Model "folder" ** ** This model transforms a folder element.
		Prints a plus (+) or minus (-) image, the folder image and a title **
	-->
	<xsl:template match="conceptTreeElement">
		<xsl:param name="rek_depth" select="1" />


		<table border="0" cellspacing="0"
			cellpadding="0">
			<xsl:if test="$startDepth=1 and $rek_depth=1">
				<xsl:attribute name="width">1000</xsl:attribute>
			</xsl:if>
			<tr>
				<!--
					If startDepth is on first level, do not shift of $param-shift-width
				-->
				<xsl:if test="$startDepth>1 and not ($rek_depth>1)">
					<td width="{$param-shift-width}" />
				</xsl:if>
				<!-- For every level below, shift-->
				<xsl:if test="$rek_depth>1">
					<td width="{$param-shift-width}" />
					
				</xsl:if>
				<!-- Shift if it is a leaf, because the plus/minus image is missing-->
				<!--  <xsl:if test="@isLeaf">
					<td width="16"/>
				</xsl:if>-->
				<td class="obTreeRow">

					<xsl:call-template name="createTreeNode">
						<xsl:with-param name="actionListener" select="'categoryActionListener'" />
						<xsl:with-param name="typeOfEntity" select="'concept'" />
						<xsl:with-param name="rek_depth" select="$rek_depth" />
					</xsl:call-template>

					<!-- Shall we expand all the leaves of the treeview ? no by default-->
					<div>


						<xsl:call-template name="setExpansionState" />

						<!--
							Thanks to the magic of reccursive calls, all the descendants of
							the present folder are gonna be built
						-->
						<xsl:apply-templates select="conceptTreeElement">
							<xsl:with-param name="rek_depth" select="$rek_depth+1" />
						</xsl:apply-templates>

						<xsl:apply-templates select="categoryPartition">
							<xsl:with-param name="rek_depth" select="$rek_depth+1" />
						</xsl:apply-templates>
					</div>
				</td>

			</tr>
		</table>
	</xsl:template>

	<xsl:template match="propertyTreeElement">
		<xsl:param name="rek_depth" select="1" />


		<table class="propertyTreeElementColors" border="0" cellspacing="0"
			cellpadding="0">
			<xsl:if test="$startDepth=1 and $rek_depth=1">
				<xsl:attribute name="width">1000</xsl:attribute>
			</xsl:if>
			<tr>
				<!--
					If startDepth is on first level, do not shift of $param-shift-width
				-->
				<xsl:if test="$startDepth>1 and not ($rek_depth>1)">
					<td width="{$param-shift-width}" />
				</xsl:if>
				<!-- For every level below, shift-->
				<xsl:if test="$rek_depth>1">
					<td width="{$param-shift-width}" />
				</xsl:if>
				<!-- Shift if it is a leaf, because the plus/minus image is missing-->
				<!--  <xsl:if test="@isLeaf">
					<td width="16"/>
				</xsl:if>-->

				<td class="obTreeRow">

					<xsl:call-template name="createTreeNode">
						<xsl:with-param name="actionListener" select="'propertyActionListener'" />
						<xsl:with-param name="typeOfEntity" select="'property'" />
						<xsl:with-param name="rek_depth" select="$rek_depth" />
					</xsl:call-template>

					<!-- Shall we expand all the leaves of the treeview ? no by default-->
					<div>

						<xsl:call-template name="setExpansionState" />

						<!--
							Thanks to the magic of reccursive calls, all the descendants of
							the present folder are gonna be built
						-->
						<xsl:apply-templates select="propertyTreeElement">
							<xsl:with-param name="rek_depth" select="$rek_depth+1" />
						</xsl:apply-templates>

						<xsl:apply-templates select="propertyPartition">
							<xsl:with-param name="rek_depth" select="$rek_depth+1" />
						</xsl:apply-templates>
					</div>
				</td>
			</tr>
		</table>
	</xsl:template>



	<xsl:template match="categoryPartition">
		<xsl:param name="rek_depth" select="1" />
		<xsl:call-template name="partitionNode">
			<xsl:with-param name="actionListener" select="'categoryActionListener'" />
			<xsl:with-param name="rek_depth" select="$rek_depth" />
			<xsl:with-param name="classname" select="'categoryTreeElementColors'" />
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="propertyPartition">
		<xsl:param name="rek_depth" select="1" />
		<xsl:call-template name="partitionNode">
			<xsl:with-param name="actionListener" select="'propertyActionListener'" />
			<xsl:with-param name="rek_depth" select="$rek_depth" />
			<xsl:with-param name="classname" select="'propertyTreeElementColors'" />
		</xsl:call-template>
	</xsl:template>





	<xsl:template match="instanceList">
		<xsl:choose>
			<xsl:when test="not (@isEmpty)">
				<table class="instanceListColors" border="0" cellspacing="0"
					cellpadding="0" style="width:500px;">
					<xsl:apply-templates select="instance" />
					<xsl:apply-templates select="instancePartition" />
				</table>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="@textToDisplay"></xsl:value-of>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="instancePartition">
		<xsl:call-template name="partitionNode">
			<xsl:with-param name="actionListener" select="'instanceActionListener'" />
			<xsl:with-param name="classname" select="'instanceListColors'" />
		</xsl:call-template>
	</xsl:template>

	<xsl:template match="instance">
		<tr class="instanceListRow">
			<td style="width: 45%"><!-- <img src="{$param-img-directory}instance.gif"/> -->
				<a class="instance">
					<xsl:choose>
						<xsl:when test="gissues and @inherited">
							<xsl:attribute name="class">instance gardeningissue inherited</xsl:attribute>
						</xsl:when>
						<xsl:when test="gissues">
							<xsl:attribute name="class">instance gardeningissue</xsl:attribute>
						</xsl:when>
						<xsl:when test="@inherited">
							<xsl:attribute name="class">instance inherited</xsl:attribute>
						</xsl:when>
					</xsl:choose>
					<xsl:variable name="escapeSingleQoutesFromTitle"><xsl:call-template name="replace-string"><xsl:with-param
                        name="text" select="@title" /><xsl:with-param name="from"
                        select="$var-simple-quote" /><xsl:with-param name="to"
                        select="$var-slash-quote" /></xsl:call-template></xsl:variable>
                   
					
					<xsl:attribute name="onclick">instanceActionListener.selectInstance(event, this, '<xsl:value-of
						select="@id" />', '<xsl:call-template name="replace-string"><xsl:with-param
                        name="text" select="$escapeSingleQoutesFromTitle" /><xsl:with-param name="from"
                        select="$var-backslash" /><xsl:with-param name="to"
                        select="$var-backslash-quote" /></xsl:call-template>', '<xsl:value-of
						select="@namespace" />')</xsl:attribute>
					<xsl:attribute name="id"><xsl:value-of
						select="@id" /></xsl:attribute>
					<xsl:if test="@uri">
						<xsl:attribute name="uri"><xsl:value-of
							select="@uri" /></xsl:attribute>
					</xsl:if>
					<xsl:variable name="title" select="@title" />
					<xsl:choose>
						<xsl:when test="@namespace=''">
							<xsl:value-of select="translate($title, '_', ' ')" />
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="@namespace" />:<xsl:value-of select="translate($title, '_', ' ')" />
						</xsl:otherwise>
					</xsl:choose>

				</a>
				<xsl:call-template name="gissues">
					<xsl:with-param name="title">
						<xsl:value-of select="@title" />
					</xsl:with-param>
					<xsl:with-param name="actionListener">
						instanceActionListener
					</xsl:with-param>
					<xsl:with-param name="typeOfEntity">
						<xsl:value-of select="'instance'" />
					</xsl:with-param>
				</xsl:call-template>
		
                <span class="instanceTreeActions">
				<a class="navigationLink" style="margin-left:5px;">
					<xsl:choose>
						<xsl:when test="@localurl">
							<xsl:attribute name="href"><xsl:value-of
								select="@localurl" /></xsl:attribute>
						</xsl:when>
						<xsl:when test="@namespace=''">
							<xsl:attribute name="href"><xsl:value-of
								select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
								select="@title_url" /></xsl:attribute>
						</xsl:when>
						<xsl:otherwise>
							<xsl:attribute name="href"><xsl:value-of
								select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
								select="@namespace" />:<xsl:value-of select="@title_url" /></xsl:attribute>
						</xsl:otherwise>
					</xsl:choose>
					{{SMW_OB_OPEN}}
				</a><span style="color: #888"> |</span>
				<a class="navigationLink" style="margin-left:0px;">
                    <xsl:choose>
                        <xsl:when test="@localurl">
                            <xsl:attribute name="href"><xsl:value-of
                                select="@localurl" />
                                 <xsl:choose>
                                    <xsl:when test="@uri and @notexists">&amp;action=edit&amp;preloadNEP=true</xsl:when>
                                    <xsl:when test="@uri">&amp;action=edit</xsl:when>
                                    <xsl:otherwise>?action=edit</xsl:otherwise>
                                </xsl:choose>
                            </xsl:attribute>
                        </xsl:when>
                        <xsl:when test="@namespace=''">
                            <xsl:attribute name="href"><xsl:value-of
                                select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
                                select="@title_url" />
                                 <xsl:choose>
                                    <xsl:when test="@uri and @notexists">&amp;action=edit&amp;preloadNEP=true</xsl:when>
                                    <xsl:when test="@uri">&amp;action=edit</xsl:when>
                                    <xsl:otherwise>?action=edit</xsl:otherwise>
                                </xsl:choose>
                            </xsl:attribute>
                        </xsl:when>
                        <xsl:otherwise>
                            <xsl:attribute name="href"><xsl:value-of
                                select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
                                select="@namespace" />:<xsl:value-of select="@title_url" />
                                 <xsl:choose>
                                    <xsl:when test="@uri and @notexists">&amp;action=edit&amp;preloadNEP=true</xsl:when>
                                    <xsl:when test="@uri">&amp;action=edit</xsl:when>
                                    <xsl:otherwise>?action=edit</xsl:otherwise>
                                </xsl:choose>
                            </xsl:attribute>
                        </xsl:otherwise>
                    </xsl:choose>
                    {{SMW_OB_EDIT}} </a><span style="color: #888"> |</span>
		<a class="navigationLink" style="margin-left:0px;">
			<xsl:attribute name="onclick">instanceActionListener.deleteInstance(event, this,'<xsl:value-of select="@id" />','<xsl:value-of select="@title_url" />')</xsl:attribute>
		
                    {{SMW_OB_DELETE}}
                </a>
				</span>
				</td>
				<td>
				<xsl:if test="count(metadata/property) > 0">
					<xsl:variable name="metaid" select="child::metadata/@id" />
					<xsl:variable name="subjectID" select="@id"/>
					<img class="metadataContainerSwitch"
						src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/metadata.gif"
						data="{$metaid}" subjectID="{$subjectID}" subjectType="instance" />
				</xsl:if>
			</td>
			<td>
			     <xsl:if test="count(child::category) = 1">
                 <a style="margin-left:5px;">
                    <xsl:attribute name="onclick">instanceActionListener.showSuperCategory(event, this,'<xsl:call-template
                        name="replace-string"><xsl:with-param name="text" select="child::category" /><xsl:with-param
                        name="from" select="$var-simple-quote" /><xsl:with-param
                        name="to" select="$var-slash-quote" /></xsl:call-template>')</xsl:attribute>
                    <xsl:variable name="superCategory" select="child::category" />
                    <xsl:value-of select="translate($superCategory, '_', $var-nonbreakspace)"></xsl:value-of>
                </a>
                </xsl:if>
				<xsl:if test="count(child::category) > 1">
				<select name="selector">
				
				<xsl:for-each select="child::category">
					<option>						
						<xsl:attribute name="onclick">instanceActionListener.showSuperCategory(event, this,'<xsl:call-template
							name="replace-string"><xsl:with-param name="text" select="." /><xsl:with-param
							name="from" select="$var-simple-quote" /><xsl:with-param
							name="to" select="$var-slash-quote" /></xsl:call-template>')</xsl:attribute>
						<xsl:variable name="superCategory" select="." />
						<xsl:value-of select="translate($superCategory, '_', $var-nonbreakspace)"></xsl:value-of>
					
					</option>
				</xsl:for-each>
				
				</select>
				</xsl:if>
			</td>
		</tr>
		<xsl:if test="count(metadata/property) > 0">
		<tr>
			<xsl:call-template name="metadata" />
		</tr>
		</xsl:if>
	</xsl:template>

	<xsl:template match="annotationsList">
		<xsl:choose>
			<xsl:when test="not (@isEmpty)">
				<table class="propertyTreeListColors" border="0" cellspacing="0"
					cellpadding="0">
					<xsl:apply-templates select="annotation" />

				</table>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="@textToDisplay"></xsl:value-of>
				<a class="navigationLink" style="margin-left:5px;">
					<xsl:attribute name="href"><xsl:value-of
						select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
						select="@namespace" />:<xsl:value-of select="@title" />?action=annotate</xsl:attribute>
					{{SMW_OB_ADDSOME}}
				</a>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="annotation">
		<tr class="annotationListRows">
			<td>
				<xsl:attribute name="rowspan"><xsl:value-of
					select="count(child::param)" /></xsl:attribute>
				<xsl:variable name="icon" select="@img" />
				<!-- <img src="{$param-img-directory}../../{$icon}"/>  -->
				<xsl:variable name="title" select="@title" />
				<a title="{$title}" class="annotation">
				<xsl:attribute name="id"><xsl:value-of
                        select="@id" /></xsl:attribute>
					<xsl:attribute name="onclick">annotationActionListener.selectProperty(event, this,'<xsl:call-template
						name="replace-string"><xsl:with-param name="text" select="@title" /><xsl:with-param
						name="from" select="$var-simple-quote" /><xsl:with-param
						name="to" select="$var-slash-quote" /></xsl:call-template>')</xsl:attribute>
					<xsl:if test="gissues">
						<xsl:attribute name="class">gardeningissue</xsl:attribute>
					</xsl:if>
					<xsl:if test="@inferred">
                        <xsl:attribute name="class">inherited</xsl:attribute>
                    </xsl:if>
					<xsl:if test="@uri">
                    <xsl:attribute name="uri"><xsl:value-of
                            select="@uri" /></xsl:attribute>
                            </xsl:if>
					<xsl:choose>
						<xsl:when test="string-length($title) > $maximumEntityLength">
							<xsl:value-of
								select="concat(substring(translate($title, '_', ' '),1,$maximumEntityLength),'...')" />
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="translate($title, '_', ' ')" />
						</xsl:otherwise>
					</xsl:choose>

				</a>
				<xsl:call-template name="gissues">
					<xsl:with-param name="title">
						<xsl:value-of select="@title" />
					</xsl:with-param>
					<xsl:with-param name="actionListener">
						propertyActionListener
					</xsl:with-param>
					<xsl:with-param name="typeOfEntity">
						<xsl:value-of select="'property'" />
					</xsl:with-param>
				</xsl:call-template>
				<span class="annotationListActions">
				<a class="navigationLink" title="Goto to {$title}" style="margin-left:5px;">
					<xsl:attribute name="href"><xsl:value-of
						select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
						select="$param-ns-property" />:<xsl:value-of select="@title_url" /></xsl:attribute>
					{{SMW_OB_OPEN}}
				</a>
				</span>
				<xsl:if test="count(metadata/property) > 0">
					<xsl:variable name="metaid" select="child::metadata/@id" />
					<xsl:variable name="subjectID" select="@id"/>
                    <img class="metadataContainerSwitch"
                        src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/metadata.gif"
                        data="{$metaid}" subjectID="{$subjectID}" subjectType="annotation" />
				</xsl:if>
			</td>
			<td align="right">

				<xsl:choose>
					<xsl:when test="child::param[1][@isLink]">
						<a style="margin-left:5px;">
        					    <xsl:if test="child::param[1][@uri]">
			                        <xsl:attribute name="uri"><xsl:value-of
			                            select="child::param[1]/@uri" /></xsl:attribute>
                                </xsl:if>
                                <xsl:if test="child::param[1][@url]">
                                      <xsl:attribute name="href"><xsl:value-of
                                                select="child::param[1]/@url" /></xsl:attribute>
                                </xsl:if>
                      
							<xsl:choose>
								<xsl:when test="child::param[1][@notexists]">
									
									<xsl:attribute name="class">annotation titleNotExists</xsl:attribute>
								</xsl:when>
								<xsl:otherwise>
									
									<xsl:attribute name="class">annotation</xsl:attribute>
								</xsl:otherwise>
							</xsl:choose>
						
							<xsl:variable name="target" select="child::param[1]" />
							<xsl:value-of select="translate($target, '_', ' ')" />
						</a>
					</xsl:when>
					<xsl:otherwise>
					 <xsl:attribute name="typeURI"><xsl:value-of
                                        select="child::param[1]/@typeURI" /></xsl:attribute>
                                       
						<xsl:if test="@needRepaste">
							<xsl:attribute name="needRepaste">true</xsl:attribute>
						</xsl:if>
						<xsl:value-of disable-output-escaping="yes"
							select="child::param[1]" />
					</xsl:otherwise>
				</xsl:choose>

			</td>
		</tr>
		<xsl:for-each select="child::param">
			<xsl:if test="position()!=1">
				<tr>
					<td align="right">

						<xsl:choose>
							<xsl:when test="@isLink">
								<a style="margin-left:5px;">

										   <xsl:if test="@uri">
		                                     <xsl:attribute name="uri"><xsl:value-of
		                                        select="@uri" /></xsl:attribute>
			                                </xsl:if>
			                                <xsl:if test="@url">
			                                      <xsl:attribute name="href"><xsl:value-of
			                                                select="@url" /></xsl:attribute>
			                                </xsl:if>
									<xsl:choose>
										<xsl:when test="@notexists">
											
											<xsl:attribute name="class">annotation titleNotExists</xsl:attribute>
										</xsl:when>
										<xsl:otherwise>
											
											<xsl:attribute name="class">annotation</xsl:attribute>
										</xsl:otherwise>
									</xsl:choose>
									<xsl:variable name="target" select="." />
									<xsl:value-of select="translate($target, '_', ' ')" />
								</a>
							</xsl:when>
							<xsl:otherwise>
								<xsl:if test="../@needRepaste">
									<xsl:attribute name="needRepaste">true</xsl:attribute>
								</xsl:if>
								<xsl:value-of disable-output-escaping="yes" select="." />
							</xsl:otherwise>
						</xsl:choose>
					</td>
				</tr>
			</xsl:if>
		</xsl:for-each>
		<xsl:if test="count(metadata/property) > 0">
		<tr>
			<xsl:call-template name="metadata" />
		</tr>
		</xsl:if>
	</xsl:template>


	<xsl:template match="propertyList">
		<xsl:choose>
			<xsl:when test="not (@isEmpty)">
				<table class="propertyTreeListColors" border="0" cellspacing="0"
					cellpadding="0">
					<xsl:apply-templates select="property" />

				</table>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="@textToDisplay"></xsl:value-of>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

	<xsl:template match="property">
		<tr class="propertyListRows">
			<xsl:variable name="title" select="@title" />
			<td>
				<xsl:attribute name="rowspan"><xsl:value-of
					select="count(child::rangeType)+1" /></xsl:attribute>
				<xsl:variable name="icon" select="@img" />
				<!-- <img src="{$param-img-directory}../../{$icon}"/> -->
				<a title="{$title}" class="attribute">
				<xsl:attribute name="onclick">schemaEditPropertyListener.selectProperty(event, this,'<xsl:call-template
                        name="replace-string"><xsl:with-param name="text" select="@title" /><xsl:with-param
                        name="from" select="$var-simple-quote" /><xsl:with-param
                        name="to" select="$var-slash-quote" /></xsl:call-template>','<xsl:value-of select="@minCard" />','<xsl:value-of
                                select="child::rangeType[1]" />','<xsl:call-template
                        name="replace-string"><xsl:with-param name="text" select="child::rangeType[1]/@category" /><xsl:with-param
                        name="from" select="$var-simple-quote" /><xsl:with-param
                        name="to" select="$var-slash-quote" /></xsl:call-template>')</xsl:attribute>
					
					<xsl:if test="gissues">
						<xsl:attribute name="class">attribute gardeningissue</xsl:attribute>
					</xsl:if>
					<xsl:if test="@inherited">
						<xsl:attribute name="class">attribute inherited</xsl:attribute>
					</xsl:if>
					<xsl:if test="@uri">
					<xsl:attribute name="uri"><xsl:value-of
                            select="@uri" /></xsl:attribute>
                            </xsl:if>
					<xsl:choose>
						<xsl:when test="string-length($title) > $maximumEntityLength">
							<xsl:value-of
								select="concat(substring(translate($title, '_', ' '),1,$maximumEntityLength),'...')" />
						</xsl:when>
						<xsl:otherwise>
							<xsl:value-of select="translate($title, '_', ' ')" />
						</xsl:otherwise>
					</xsl:choose>
				</a>



				<xsl:call-template name="gissues">
					<xsl:with-param name="title">
						<xsl:value-of select="@title" />
					</xsl:with-param>
					<xsl:with-param name="actionListener">
						propertyActionListener
					</xsl:with-param>
					<xsl:with-param name="typeOfEntity">
						<xsl:value-of select="'property'" />
					</xsl:with-param>
				</xsl:call-template>
			</td>
			<td>
				<xsl:attribute name="rowspan"><xsl:value-of
					select="count(child::rangeType)+1" /></xsl:attribute>
				<span class="propertyListActions">	
				<a class="navigationLink" title="Goto to {$title}" style="margin-left:5px;">
					<xsl:attribute name="href"><xsl:value-of
						select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
						select="$param-ns-property" />:<xsl:value-of select="@title_url" /></xsl:attribute>
					{{SMW_OB_OPEN}}
				</a><xsl:if test="not(@noedit)">
				    <span style="color: #888"> |</span>
                    <a class="attribute" title="Edit {$title}">
					<xsl:attribute name="href"><xsl:value-of
                        select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
                        select="$param-ns-property" />:<xsl:value-of select="@title_url" />?action=edit</xsl:attribute>				
					{{SMW_OB_EDIT}}
				</a>
				</xsl:if>
				</span>
			</td>
			<td>
				<xsl:attribute name="rowspan"><xsl:value-of
					select="count(child::rangeType)+1" /></xsl:attribute>
				(<xsl:value-of select="@num" />)
			</td>
			<td align="right">
				<xsl:choose>
					<xsl:when test="child::rangeType[1]/@category">
						<a class="category">
							<xsl:attribute name="href"><xsl:value-of
								select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
								select="$param-ns-concept" />:<xsl:value-of
								select="child::rangeType[1]/@category" />?action=edit</xsl:attribute>
							<xsl:value-of select="translate(child::rangeType[1]/@category, '_', ' ')" />
						</a>
					</xsl:when>
					<xsl:otherwise>
						<xsl:value-of select="translate(child::rangeType[1], '_', ' ')" />
					</xsl:otherwise>
				</xsl:choose>

			</td>

		</tr>
		<xsl:for-each select="child::rangeType">
			<xsl:if test="position()!=1">
				<tr>
					<td align="right">

						<xsl:choose>
							<xsl:when test="@isLink">
								<a class="category">
									<xsl:attribute name="onclick">categoryActionListener.navigateToEntity(event, this,'<xsl:call-template
										name="replace-string"><xsl:with-param name="text" select="." /><xsl:with-param
										name="from" select="$var-simple-quote" /><xsl:with-param
										name="to" select="$var-slash-quote" /></xsl:call-template>')</xsl:attribute>
									<xsl:value-of select="@name" />
									<xsl:value-of select="translate(self::node(), '_', ' ')" />
								</a>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="@name" />
								<xsl:value-of select="translate(self::node(), '_', ' ')" />
							</xsl:otherwise>
						</xsl:choose>

					</td>
				</tr>
			</xsl:if>
		</xsl:for-each>
		<tr>
			<td align="right">

				<xsl:value-of select="@minCard" />
				...
				<xsl:value-of select="@maxCard" />

				<xsl:choose>
					<xsl:when test="@isTransitive and not (@isSymetrical)">
						, transitive
					</xsl:when>
					<xsl:when test="@isSymetrical and not (@isTransitive)">
						, symetrical
					</xsl:when>
					<xsl:when test="@isSymetrical and @isTransitive">
						, transitive/symetrical
					</xsl:when>
				</xsl:choose>
			</td>
		</tr>

	</xsl:template>


	<xsl:template name="definingRule">
		<xsl:variable name="ruleURI" select="." />
		<img class="treeviewdecorator"
			src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/rule.gif"
			onclick="ruleActionListener.selectFromExternal(this, '{$ruleURI}')"
			title="Show rule {$ruleURI}" />
	</xsl:template>

	<xsl:template name="metadata">
		<xsl:variable name="metaid" select="child::metadata/@id" />
			<table style="display: none;width: 500px;" class="metadataContainer" id="{$metaid}">
		        <th>{{SMW_OB_META_PROPERTY}}</th>
				<th>Value</th>
			    <th> <img src="{$param-img-directory}/extensions/SMWHalo/skins/expanded-close.gif" class="closeMetadataSwitch" onclick="globalActionListener.closeMetadataview(event, '{$metaid}')"/></th>
				<xsl:for-each select="child::metadata/property">
					<tr>
						<td>
							{{SMW_OB_META_<xsl:value-of select="@name" />}}
						</td>
						<td>
							<xsl:value-of select="." />
						</td>
					</tr>
				</xsl:for-each>
			</table>
		
	</xsl:template>

	<xsl:template name="gissues">
		<xsl:param name="title" />
		<xsl:param name="actionListener" />
		<xsl:param name="typeOfEntity" />
		<xsl:if test="gissues">
			<xsl:choose>
				<xsl:when test="count(gissues/gi) = count(gissues/gi[@type > 100000])">
					<!-- Display something in case of propagation -->
				</xsl:when>
				<xsl:otherwise>
					

						<xsl:choose>
							<xsl:when test="count(gissues/gi[@modified]) > 0">
							    <span>
								<img class="smwh_ob_tooltip" src="{$param-img-directory}/extensions/SMWHalo/skins/warning.png"/>
								<span style="display: none">
								{{SMW_OB_MODIFIED}}
                                    <ul>
                                        <xsl:for-each select="gissues/gi">
                                            <xsl:if test="@type &lt; 100000">
                                                <li>
                                                    <xsl:value-of select="." />
                                                </li>
                                            </xsl:if>
                                        </xsl:for-each>
                                    </ul>
								</span>
							    </span>
							</xsl:when>
							<xsl:otherwise>
							<span>
								<img class="smwh_ob_tooltip" src="{$param-img-directory}/extensions/SMWHalo/skins/warning.png"/>
                                <span style="display: none">
                                    <ul>
                                        <xsl:for-each select="gissues/gi">
                                            <xsl:if test="@type &lt; 100000">
                                                <li>
                                                    <xsl:value-of select="." />
                                                </li>
                                            </xsl:if>
                                        </xsl:for-each>
                                    </ul>
                                </span>
                                </span>
							</xsl:otherwise>
						</xsl:choose>


					
					
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
	</xsl:template>


	<xsl:template name="setExpansionState">
		<xsl:if test="@expanded">
			<xsl:if test="@expanded='true'">
				<xsl:attribute name="style">display:block;</xsl:attribute>
			</xsl:if>
			<!-- plus (+) otherwise-->
			<xsl:if test="@expanded='false'">
				<xsl:attribute name="style">display:none;</xsl:attribute>
			</xsl:if>
		</xsl:if>

		<xsl:if test="not(@expanded)">
			<xsl:if test="$param-deploy-treeview = 'true'">
				<xsl:attribute name="style">display:block;</xsl:attribute>
			</xsl:if>
			<xsl:if test="$param-deploy-treeview = 'false'">
				<xsl:attribute name="style">display:none;</xsl:attribute>
			</xsl:if>
		</xsl:if>
	</xsl:template>

	<xsl:template name="createTreeNode">
		<xsl:param name="actionListener" />
		<xsl:param name="typeOfEntity" />
		<xsl:param name="rek_depth" />
                <div>
                <xsl:attribute name="class"><xsl:value-of select="$typeOfEntity" />TreeElementColors</xsl:attribute>
		        <span class="obTreeSelection">
			
			        <xsl:if test="gissues">
				  <xsl:attribute name="class"><xsl:value-of select="$typeOfEntity" /> gardeningissue</xsl:attribute>
			        </xsl:if>
			        <xsl:if test="@id">
				    <xsl:attribute name="onclick"><xsl:value-of select="$actionListener" />.select(event, this,'<xsl:value-of
					select="@id" />','<xsl:call-template name="replace-string"><xsl:with-param
					name="text" select="@title" /><xsl:with-param name="from"
					select="$var-simple-quote" /><xsl:with-param name="to"
					select="$var-slash-quote" /></xsl:call-template>')</xsl:attribute>
				    <xsl:attribute name="id"><xsl:value-of select="@id" /></xsl:attribute>
			        </xsl:if>
			        <xsl:if test="@title">
				    <xsl:attribute name="title"><xsl:value-of select="@title" /></xsl:attribute>
			        </xsl:if>
			        <xsl:if test="@uri">
                                <xsl:attribute name="uri"><xsl:value-of
                                     select="@uri" /></xsl:attribute>
                                </xsl:if>
			        <xsl:if test="@uri">
                                    <xsl:attribute name="uri"><xsl:value-of
                                    select="@uri" /></xsl:attribute>
                                </xsl:if>
			        <xsl:if test="$rek_depth=1">
				    <xsl:if test="@hidden='true'">
					<xsl:attribute name="style">display: none;</xsl:attribute>
				    </xsl:if>
			        </xsl:if>
			        <!-- If the treeview is unfold, the image minus (-) is displayed-->

			        <xsl:if test="@expanded='true'">
				    <xsl:choose>
					<xsl:when test="not (@isLeaf)">
						<img
							src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/minus.gif">
							<xsl:if test="@id">
								<xsl:attribute name="onclick"><xsl:value-of
									select="$actionListener" />.toggleExpand(event, this.parentNode, '<xsl:value-of
									select="@id" />')</xsl:attribute>
							</xsl:if>

						</img>
					</xsl:when>
					<xsl:otherwise>
						<img
							src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/minus.gif">
							<xsl:if test="@id">
								<xsl:attribute name="style">visibility: hidden;</xsl:attribute>
								<xsl:attribute name="onclick"><xsl:value-of
									select="$actionListener" />.toggleExpand(event, this.parentNode, '<xsl:value-of
									select="@id" />')</xsl:attribute>
							</xsl:if>

						</img>
					</xsl:otherwise>
				    </xsl:choose>
			        </xsl:if>
			        <xsl:if test="@expanded='false' or not(@expanded)">
				<!-- plus (+) otherwise-->
				   <xsl:choose>
					<xsl:when test="not (@isLeaf)">
						<img
							src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/plus.gif">
							<xsl:if test="@id">
								<xsl:attribute name="onclick"><xsl:value-of
									select="$actionListener" />.toggleExpand(event, this.parentNode, '<xsl:value-of
									select="@id" />')</xsl:attribute>
							</xsl:if>

						</img>
					</xsl:when>
					<xsl:otherwise>
						<img
							src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/plus.gif">
							<xsl:if test="@id">
								<xsl:attribute name="style">visibility: hidden;</xsl:attribute>
								<xsl:attribute name="onclick"><xsl:value-of
									select="$actionListener" />.toggleExpand(event, this.parentNode, '<xsl:value-of
									select="@id" />')</xsl:attribute>
							</xsl:if>

						</img>
					</xsl:otherwise>
				    </xsl:choose>

			        </xsl:if>
			        <!--
				<xsl:if test="not(@expanded)"> <xsl:if test="$param-deploy-treeview
				= 'true'"> <img
				src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/minus.gif">
				<xsl:if test="@id"> <xsl:attribute name="onclick"><xsl:value-of
				select="$actionListener"/>.toggleExpand(event, this.parentNode,
				'<xsl:value-of select="@id"/>')</xsl:attribute> </xsl:if> </img>
				</xsl:if> <xsl:if test="$param-deploy-treeview = 'false' or
				not(@expanded)"> <img
				src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/plus.gif">
				<xsl:if test="@id"> <xsl:attribute name="onclick"><xsl:value-of
				select="$actionListener"/>.toggleExpand(event, this.parentNode,
				'<xsl:value-of select="@id"/>')</xsl:attribute> </xsl:if> </img>
				</xsl:if> </xsl:if>
			        -->
			        <xsl:if test="$rek_depth>1">
				    <xsl:choose>
					<xsl:when test="position()=last()">
						<img
							src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/lastlink.gif" />
					</xsl:when>
					<xsl:otherwise>
						<img
							src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/link.gif" />
					</xsl:otherwise>
				    </xsl:choose>
			        </xsl:if>
			        <xsl:if test="$startDepth>1">
				    <xsl:choose>
					<xsl:when test="position()=last()">
						<img
							src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/lastlink.gif" />
					</xsl:when>
					<xsl:otherwise>
						<img
							src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/link.gif" />
					</xsl:otherwise>
				    </xsl:choose>
			        </xsl:if>
			        <!--
				<img src="{$param-img-directory}{@img}"> <xsl:if test="@alt">

				<xsl:if test="$param-is-netscape='true'"> <xsl:attribute
				name="title"><xsl:value-of select="@alt"/></xsl:attribute> </xsl:if>

				<xsl:if test="$param-is-netscape='false'"> <xsl:attribute
				name="alt"><xsl:value-of select="@alt"/></xsl:attribute> </xsl:if>
				</xsl:if> </img>
			        -->
			        <xsl:variable name="titleWithoutUnderscore" select="@title" />
			        <xsl:value-of select="translate($titleWithoutUnderscore, '_', ' ')" />
		        
			</span>
                      
		     
		        <xsl:variable name="title" select="@title" />
		        <xsl:for-each select="child::definingRule">
			     <xsl:call-template name="definingRule" />
		        </xsl:for-each>
		        <xsl:call-template name="gissues">
			    <xsl:with-param name="title">
				<xsl:value-of select="@title" />
			    </xsl:with-param>
			    <xsl:with-param name="actionListener">
				<xsl:value-of select="$actionListener" />
			    </xsl:with-param>
			    <xsl:with-param name="typeOfEntity">
				<xsl:value-of select="$typeOfEntity" />
			    </xsl:with-param>
		        </xsl:call-template>
                
                <span class="categoryTreeActions">
		        <a  class="openEditLink" title="Goto to {$title}" style="margin-left:5px;">
			    <xsl:choose>
				<xsl:when test="$typeOfEntity='concept'">
					<xsl:attribute name="href"><xsl:value-of
						select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
						select="$param-ns-concept" />:<xsl:value-of select="@title_url" /></xsl:attribute>
				</xsl:when>
				<xsl:when test="$typeOfEntity='property'">
					<xsl:attribute name="href"><xsl:value-of
						select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
						select="$param-ns-property" />:<xsl:value-of select="@title_url" /></xsl:attribute>
				</xsl:when>
			    </xsl:choose>
			   {{SMW_OB_OPEN}}
		        </a><span class="openEditLink" style="color: #888"> |</span>
			<a  class="openEditLink" title="Edit to {$title}" style="margin-left:5px;">
                <xsl:choose>
                <xsl:when test="$typeOfEntity='concept'">
                    <xsl:attribute name="href"><xsl:value-of
                        select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
                        select="$param-ns-concept" />:<xsl:value-of select="@title_url" />?action=edit</xsl:attribute>
                </xsl:when>
                <xsl:when test="$typeOfEntity='property'">
                    <xsl:attribute name="href"><xsl:value-of
                        select="substring-before($param-wiki-path,'$1')" /><xsl:value-of
                        select="$param-ns-property" />:<xsl:value-of select="@title_url" />?action=edit</xsl:attribute>
                </xsl:when>
                </xsl:choose>
               {{SMW_OB_EDIT}}
                </a>  
                </span>
                </div>
	</xsl:template>

	<xsl:template name="partitionNode">
		<xsl:param name="rek_depth" />
		<xsl:param name="actionListener" />
		<xsl:param name="classname" />
		<table border="0" cellspacing="0" cellpadding="0" class="{$classname}">
			<tr>
				<xsl:if test="$startDepth>1 and not ($rek_depth>1)">
					<td width="{$param-shift-width}" />
				</xsl:if>

				<xsl:if test="$rek_depth>1">
					<td width="{$param-shift-width}" />
				</xsl:if>
				<td>
					<xsl:if test="not (@hidePreviousArrow)">
						<a>
							<xsl:attribute name="partitionNum"><xsl:value-of
								select="@partitionNum" /></xsl:attribute>
							<xsl:attribute name="dataSrc"><xsl:value-of
								select="@dataSrc" /></xsl:attribute>
							<xsl:attribute name="id"><xsl:value-of
								select="@id" /></xsl:attribute>
							<xsl:attribute name="length"><xsl:value-of
								select="@length" /></xsl:attribute>
							<xsl:attribute name="onclick"><xsl:value-of
								select="$actionListener" />.selectPreviousPartition(event, this)</xsl:attribute>
							<img
								src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/pfeil_links.gif" />
							prev
						</a>
					</xsl:if>
				</td>
				<td width="5" />
				<!-- <td><xsl:value-of select="@partitionNum"/></td> -->
				<td width="5" />
				<td>
					<xsl:if test="not (@hideNextArrow)">
						<a>
							<xsl:attribute name="partitionNum"><xsl:value-of
								select="@partitionNum" /></xsl:attribute>
							<xsl:attribute name="dataSrc"><xsl:value-of
								select="@dataSrc" /></xsl:attribute>
							<xsl:attribute name="id"><xsl:value-of
								select="@id" /></xsl:attribute>
							<xsl:attribute name="length"><xsl:value-of
								select="@length" /></xsl:attribute>
							<xsl:attribute name="onclick"><xsl:value-of
								select="$actionListener" />.selectNextPartition(event, this)</xsl:attribute>
							next
							<img
								src="{$param-img-directory}/extensions/SMWHalo/skins/OntologyBrowser/images/pfeil_rechts.gif" />
						</a>
					</xsl:if>
				</td>
			</tr>
		</table>
	</xsl:template>

	<xsl:template name="replace-string">
		<xsl:param name="text" />
		<xsl:param name="from" />
		<xsl:param name="to" />
		<xsl:choose>
			<xsl:when test="contains($text, $from)">
				<xsl:variable name="before" select="substring-before($text, $from)" />
				<xsl:variable name="after" select="substring-after($text, $from)" />
				<xsl:variable name="prefix" select="concat($before, $to)" />
				<xsl:value-of select="$before" />
				<xsl:value-of select="$to" />
				<xsl:call-template name="replace-string">
					<xsl:with-param name="text" select="$after" />
					<xsl:with-param name="from" select="$from" />
					<xsl:with-param name="to" select="$to" />
				</xsl:call-template>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$text" />
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>

</xsl:stylesheet>
