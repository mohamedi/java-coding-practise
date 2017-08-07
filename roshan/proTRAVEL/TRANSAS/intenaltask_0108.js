<html>
<head>
    <title>Contract Creation</title>
</head>
<body>
    <style type="text/css">
        body {
            height: 100%;
            font-family: "Segoe UI", Arial, Sans-Serif;
            font-size: 12px;
            margin: 0 !important;
            padding: 0 !important;
            border: 0 !important;
            color: #000000;
            direction: ltr;
            background: #ffffff;
            overflow: auto;
            overflow-x: hidden;
            overflow-y: hidden;
        }

        .pcmButton {
            -ms-text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            overflow-x: hidden;
            overflow-y: hidden;
            -ms-word-wrap: normal;
            word-wrap: normal;
            text-align: center;
            border: 1px solid #c6c6c6;
            background-color: #FDFDFD;
            min-width: 60px;
            height: 20px;
            width: auto;
            background-image: url("");
        }

        .pcmContainer {
            /*width: 150px;*/
        }

        table {
            border: 1px solid #c6c6c6;
            width: auto;
            padding-left: 2px;
            height: 19px;
            line-height: 19px;
            border-collapse: separate;
            border-spacing: 2px;
            border-color: grey;
        }

        th {
            color: #444444;
            -ms-text-overflow: ellipsis;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            font-weight: bold;
            font-size: 12px;
        }

        tr {
            border-bottom: none;
            height: 28px;
            padding-top: 1px;
            margin-bottom: 1px;
            border-top: none;
            display: table-row;
            vertical-align: inherit;
            border-collapse: collapse;
            color: #000000;
            border-bottom-color: #FFFFFF;
            border-bottom-width: 1px;
            border-bottom-style: solid;
        }

        td {
            padding-left: 40px;
        }

        .pcm-List-Header-Lite {
            width: 100%;
            height: 22px;
            table-layout: fixed;
            border-bottom-color: #d6d6d6;
            border-bottom-style: solid;
            border-bottom-width: 1px;
            border-top-color: #d6d6d6;
            border-top-style: solid;
            border-top-width: 1px;
        }
    </style>
    <meta http-equiv="X-UA-Compatible" content="IE=8,chrome=1">

    <meta http-equiv="X-UA-Compatible" content="IE=8,chrome=1">
    <!--<script src="../pcm_/js/jquery.js" type="text/javascript"></script>-->
    <script src="../xrmc_/js/jquery.min.js" type="text/javascript"></script>
    <script src="../ClientGlobalContext.js.aspx" type="text/javascript"></script>
    <script src="../pcm_/js/json2.js" type="text/javascript"></script>
    <script src="../pcm_/js/XrmServiceToolkit.min.js" type="text/javascript"></script>

    <!--<script src="../jqueryui.js" type="text/javascript"></script>
    <link href="../jqueryui.css" rel="stylesheet" type="text/css">-->

    <script type="text/javascript">

        var localizedString =
                {
                    SelectContractBlocks: {
                        _1033: "Select Contract Blocks",
                        _1031: "Vertragsblöcke",
                    },

                    EffectiveFromDate: {
                        _1033: "Effective from",
                        _1031: "Gültig ab",
                    },

                    CreateContract: {
                        _1033: "Create Contract",
                        _1031: "Vertrag erstellen",
                    },
                    CreateContractTitle: {
                        _1033: "Create the contract document",
                        _1031: "Das Vertragsdokument erstellen",
                    }
                }

        var lcid = "_" + window.parent.Xrm.Page.context.getUserLcid();

        // default to German
        if (lcid != "_1033")
            lcid = "_1031";

        function loadContractBlocks() {
            var contracttype = window.parent.Xrm.Page.getAttribute("pcm_contracttype").getValue();
            if (contracttype == null) {
                contracttype = -1;
            }

            var fetchXML = getContractBlocks(contracttype);
            var contractBlocks = XrmServiceToolkit.Soap.Fetch(fetchXML);
            var table = document.getElementById("pcmContractBlocks");
            table.innerHTML = '<thead><tr><th>' + localizedString.SelectContractBlocks[lcid] + '</th><th style="width:30%;">' + localizedString.EffectiveFromDate[lcid] + '</th></tr></thead>';

            for (var i = 0; i < contractBlocks.length; i++) {
                debugger;
                var contractBlockName = contractBlocks[i].attributes["ba.pcm_name"].value;
                var contractBlockGuid = contractBlocks[i].attributes.pcm_contractblockid.id;
                var row = table.insertRow(-1);

                if (contractBlocks[i].attributes.pcm_mandatory != null && contractBlocks[i].attributes.pcm_mandatory.value) {
                    row.innerHTML = "<td><input name='blocks' value='" + contractBlockGuid + "' style='text-align: center; vertical-align: top;' type='checkbox' checked='checked' disabled='disabled'>" + contractBlockName;
                    row.innerHTML += "\n<input name='blocks' value='" + contractBlockGuid + "' type='hidden'/></td>";
                } else {
                    row.innerHTML = "<td><input name='blocks' value='" + contractBlockGuid + "' style='text-align: center; vertical-align: top;' type='checkbox'>" + contractBlockName + "</td>"
                };

                //debugger;

                var today = new Date();

                if (contractBlocks[i].attributes.pcm_effectivefrom != null && contractBlocks[i].attributes.pcm_effectiveto != null) {

                    if (contractBlocks[i].attributes.pcm_effectivefrom.value <= today && contractBlocks[i].attributes.pcm_effectiveto.value >= today) {
                        row.innerHTML += "\n<td>" + contractBlocks[i].attributes.pcm_effectivefrom.formattedValue + "</td>";
                    } else {
                        row.innerHTML += "\n<td style='color:red'>Abgelaufen</td>";
                    }

                } else if (contractBlocks[i].attributes.pcm_effectivefrom != null) {

                    if (contractBlocks[i].attributes.pcm_effectivefrom.value <= today) {
                        row.innerHTML += "\n<td>" + contractBlocks[i].attributes.pcm_effectivefrom.formattedValue + "</td>";
                    } else {
                        row.innerHTML += "\n<td style='color:red'>Abgelaufen</td>";
                    }

                } else if (contractBlocks[i].attributes.pcm_effectiveto != null) {

                    if (contractBlocks[i].attributes.pcm_effectiveto.value >= today) {
                        row.innerHTML += "\n<td>" + contractBlocks[i].attributes.pcm_effectivefrom.formattedValue + "</td>";
                    } else {
                        row.innerHTML += "\n<td style='color:red'>Abgelaufen</td>";
                    }
                }
            }
        }

        function getContractBlocks(contracttype) {

            var today = new Date().format("yyyy-MM-dd");

            //debugger;

            var fetchXML =
            '<fetch version="1.0" output-format="xml-platform" mapping="logical" distinct="true">'
            + '<entity name="pcm_contractconfiguration">'
            + '<attribute name="pcm_contracttype" />'
            + '<attribute name="pcm_contractblockid" />'
            + '<attribute name="pcm_sortorder" />'
            + '<attribute name="pcm_mandatory" />'
            + '<attribute name="pcm_effectivefrom" />'
            + '<attribute name="pcm_effectiveto" />'
            + '<attribute name="pcm_contractconfigurationid" />'
            + '<order attribute="pcm_sortorder" descending="false" />'
            + '<order attribute="pcm_contractblockid" descending="false" />'
            + '<filter type="and">'
            + '<condition attribute="pcm_contracttype" operator="eq" value="' + contracttype + '" />'
            //+ '<filter type="or">'
            //+ '<filter type="and">'
            //+ '<condition attribute="pcm_effectivefrom" operator="null" />'
            //+ '<condition attribute="pcm_effectiveto" operator="null" />'
            //+ '</filter>'
            //+ '<filter type="and">'
            //+ '<condition attribute="pcm_effectivefrom" operator="on-or-before" value="' + today + '" />'
            //+ '<condition attribute="pcm_effectiveto" operator="on-or-after" value="' + today + '" />'
            //+ '</filter>'
            //+ '<filter type="and">'
            //+ '<condition attribute="pcm_effectivefrom" operator="null" />'
            //+ '<condition attribute="pcm_effectiveto" operator="on-or-after" value="' + today + '" />'
            //+ '</filter>'
            //+ '<filter type="and">'
            //+ '<condition attribute="pcm_effectiveto" operator="null" />'
            //+ '<condition attribute="pcm_effectivefrom" operator="on-or-before" value="' + today + '" />'
            //+ '</filter>'
            //+ '</filter>'
            + '</filter>'
            + '<link-entity name="pcm_contractblock" from="pcm_contractblockid" to="pcm_contractblockid" alias="ba">'
            + '<attribute name="pcm_name"/>'
            + '<filter type="and">'
            + '<condition attribute="pcm_type" operator="ne" value="100000001" />'   //Kündigung / Termination
            + '</filter>'
            + '<link-entity name="annotation" from="objectid" to="pcm_contractblockid" alias="bb">'
            + '<filter type="and">'
            + '<condition attribute="isdocument" operator="eq" value="1" />'
            + '</filter>'
            + '</link-entity>'
            + '</link-entity>'
            + '</entity>'
            + '</fetch>';

            return fetchXML;
        };

        function callAction(jsonString) {
            try {
                var requestMain = "   <request xmlns:a=\"http://schemas.microsoft.com/xrm/2011/Contracts\">";
                requestMain += "        <a:Parameters xmlns:b=\"http://schemas.datacontract.org/2004/07/System.Collections.Generic\">";
                requestMain += "          <a:KeyValuePairOfstringanyType>";
                requestMain += "            <b:key>Target</b:key>";
                requestMain += "            <b:value i:type=\"a:EntityReference\">";
                requestMain += "              <a:Id>" + window.parent.Xrm.Page.data.entity.getId() + "</a:Id>";
                requestMain += "              <a:LogicalName>" + window.parent.Xrm.Page.data.entity.getEntityName() + "</a:LogicalName>";
                requestMain += "              <a:Name i:nil=\"true\" />";
                requestMain += "            </b:value>";
                requestMain += "          </a:KeyValuePairOfstringanyType>";
                requestMain += "          <a:KeyValuePairOfstringanyType>";
                requestMain += "            <b:key>Selection</b:key>";
                requestMain += "            <b:value i:type=\"c:string\" xmlns:c=\"http://www.w3.org/2001/XMLSchema\">" +  jsonString + "</b:value>";
                requestMain += "          </a:KeyValuePairOfstringanyType>";
                requestMain += "        </a:Parameters>";
                requestMain += "        <a:RequestId i:nil=\"true\" />"
                requestMain += "        <a:RequestName>pcm_CreateContractDocument</a:RequestName>";
                requestMain += "      </request>";

                console.log('Execute "pcm_CreateContractDocument" request');

                var cloneResp = XrmServiceToolkit.Soap.Execute(requestMain);
                var $response = $(cloneResp);

                console.log('Response length received: ' + $response.length);

                var id = $response.children(":first").children(":first").children(":first").children(":first").children("a\\:Results").children("a\\:KeyValuePairOfstringanyType").children("b\\:value").children("a\\:Id").text();
                var logicalName = $response.children(":first").children(":first").children(":first").children(":first").children("a\\:Results").children("a\\:KeyValuePairOfstringanyType").children("b\\:value").children("a\\:LogicalName").text();

                if (typeof id != "undefined" && id != null && id != "") {

                    if (window.parent.Xrm.Page.data.entity.getIsDirty()) {
                        console.log('Form is dirty. Save!!!');
                        window.parent.Xrm.Page.data.entity.save();
                    } else {
                        console.log('Form is not dirty. Refresh!!');
                        window.parent.Xrm.Page.data.refresh();
                    }
                    Xrm.Utility.openEntityForm("annotation", id);
                } else {
                    Xrm.Utility.alertDialog("An error occured while creating document.");
                }

            }
            catch (e) {
                Xrm.Utility.alertDialog(e.message, function () { });
            }
        }
    </script>



    <script type="text/javascript">
        $(document).ready(function () {
            init();
        });

        init = function () {

            loadContractBlocks();
            window.parent.Xrm.Page.getAttribute("pcm_contracttype").addOnChange(loadContractBlocks);

            $('#pcmCreateButton').attr('title', localizedString.CreateContractTitle[lcid]);
            $('#pcmCreateButton').text(localizedString.CreateContract[lcid]);
        };

        $.fn.serializeObject = function () {
            var o = {};
            var a = this.serializeArray();
            $.each(a, function () {
                if (o[this.name] !== undefined) {
                    if (!o[this.name].push) {
                        o[this.name] = [o[this.name]];
                    }
                    o[this.name].push(this.value || '');
                } else {
                    o[this.name] = this.value || '';
                }
            });
            return o;
        };

        console.log('create function');

        var pcmCreateDocument = function () {

            console.log('running function pcmCreateDocument');

            if (window.parent.Xrm.Page.data.entity.getIsDirty()) {
                console.log('Form is dirty. Save before create document!!!');
                window.parent.Xrm.Page.data.entity.save();
            } else {
                console.log('Form is not dirty. Continue with document creation.');
            }

            var json = $('form').serializeObject();

            if ($.isArray(json.blocks)) {
                var guidsAsString = json.blocks.join(',');
                callAction(guidsAsString);
            }
            else {
                var guidAsString = json.blocks;
                callAction(guidAsString);
            }

        };

    </script>
    <div class="pcmContainer">
        <form action="" method="post">
            <table class="pcm-List-Header-Lite" id="pcmContractBlocks" style="margin-right: auto; margin-left: auto; empty-cells: hide;" border="0" cellspacing="1" cellpadding="1">
                <thead>
                    <tr>
                        <th>Select Contract Blocks</th>
                        <th>Effective From</th>
                    </tr>
                </thead>
            </table>
            <button title="Create Contract" class="pcmButton" id="pcmCreateButton" onclick="pcmCreateDocument()" type="button">Create Contract</button>
            <p></p>
        </form>
    </div>

</body>
</html>