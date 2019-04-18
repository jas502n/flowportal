
/*********************app系统功能**********************/
--YZMDCountry
declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'YZMDCOUNTRY';
if(cnt = 0) then
execute immediate 'CREATE TABLE YZMDCOUNTRY (
"NAME" NVARCHAR2(50) NULL,
"NAME_EN" NVARCHAR2(50) NULL,
"IDDCODE" NVARCHAR2(50) NOT NULL
)';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''安哥拉'',N''Angola'',N''244'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''阿富汗'',N''Afghanistan'',N''93'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''阿尔巴尼亚'',N''Albania'',N''335'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''阿尔及利亚'',N''Algeria'',N''213'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''安道尔共和国'',N''Andorra'',N''376'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''安圭拉岛'',N''Anguilla'',N''1254'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''安提瓜和巴布达'',N''Antigua and Barbuda'',N''1268'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''阿根廷'',N''Argentina'',N''54'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''亚美尼亚'',N''Armenia'',N''374'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''阿森松'',N''Ascension'',N''247'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''澳大利亚'',N''Australia'',N''61'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''奥地利'',N''Austria'',N''43'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''阿塞拜疆'',N''Azerbaijan'',N''994'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''巴哈马'',N''Bahamas'',N''1242'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''巴林'',N''Bahrain'',N''973'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''孟加拉国'',N''Bangladesh'',N''880'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''巴巴多斯'',N''Barbados'',N''1246'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''白俄罗斯'',N''Belarus'',N''375'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''比利时'',N''Belgium'',N''32'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''伯利兹'',N''Belize'',N''501'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''贝宁'',N''Benin'',N''229'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''百慕大群岛'',N''Bermuda Is'',N''1441'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''玻利维亚'',N''Bolivia'',N''591'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''博茨瓦纳'',N''Botswana'',N''267'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''巴西'',N''Brazil'',N''55'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''文莱'',N''Brunei'',N''673'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''保加利亚'',N''Bulgaria'',N''359'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''布基纳法索'',N''Burkina Faso'',N''226'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''缅甸'',N''Burma'',N''95'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''布隆迪'',N''Burundi'',N''257'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''喀麦隆'',N''Cameroon'',N''237'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''加拿大'',N''Canada'',N''1'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''开曼群岛'',N''Cayman Is'',N''1345'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''中非共和国'',N''Central African Republic'',N''236'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''乍得'',N''Chad'',N''235'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''智利'',N''Chile'',N''56'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''中国'',N''China'',N''86'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''哥伦比亚'',N''Colombia'',N''57'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''刚果'',N''Congo'',N''242'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''库克群岛'',N''Cook Is'',N''682'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''哥斯达黎加'',N''Costa Rica'',N''506'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''古巴'',N''Cuba'',N''53'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''塞浦路斯'',N''Cyprus'',N''357'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''捷克'',N''Czech Republic'',N''420'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''丹麦'',N''Denmark'',N''45'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''吉布提'',N''Djibouti'',N''253'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''多米尼加共和国'',N''Dominica Rep'',N''1890'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''厄瓜多尔'',N''Ecuador'',N''593'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''埃及'',N''Egypt'',N''20'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''萨尔瓦多'',N''EI Salvador'',N''503'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''爱沙尼亚'',N''Estonia'',N''372'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''埃塞俄比亚'',N''Ethiopia'',N''251'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''斐济'',N''Fiji'',N''679'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''芬兰'',N''Finland'',N''358'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''法国'',N''France'',N''33'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''法属圭亚那'',N''French Guiana'',N''594'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''法属玻利尼西亚'',N''French Polynesia'',N''689'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''加蓬'',N''Gabon'',N''241'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''冈比亚'',N''Gambia'',N''220'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''格鲁吉亚'',N''Georgia'',N''995'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''德国'',N''Germany'',N''49'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''加纳'',N''Ghana'',N''233'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''直布罗陀'',N''Gibraltar'',N''350'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''希腊'',N''Greece'',N''30'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''格林纳达'',N''Grenada'',N''1809'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''关岛'',N''Guam'',N''1671'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''危地马拉'',N''Guatemala'',N''502'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''几内亚'',N''Guinea'',N''224'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''圭亚那'',N''Guyana'',N''592'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''海地'',N''Haiti'',N''509'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''洪都拉斯'',N''Honduras'',N''504'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''香港（中国）'',N''Hongkong'',N''852'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''匈牙利'',N''Hungary'',N''36'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''冰岛'',N''Iceland'',N''354'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''印度'',N''India'',N''91'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''印度尼西亚'',N''Indonesia'',N''62'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''伊朗'',N''Iran'',N''98'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''伊拉克'',N''Iraq'',N''964'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''爱尔兰'',N''Ireland'',N''353'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''以色列'',N''Israel'',N''972'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''意大利'',N''Italy'',N''39'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''科特迪瓦'',N''Ivory Coast'',N''225'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''牙买加'',N''Jamaica'',N''1876'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''日本'',N''Japan'',N''81'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''约旦'',N''Jordan'',N''962'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''柬埔寨'',N''Kampuchea (Cambodia )'',N''855'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''哈萨克斯坦'',N''Kazakstan'',N''327'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''肯尼亚'',N''Kenya'',N''254'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''韩国'',N''Korea'',N''82'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''科威特'',N''Kuwait'',N''965'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''吉尔吉斯坦'',N''Kyrgyzstan'',N''331'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''老挝'',N''Laos'',N''856'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''拉脱维亚'',N''Latvia'',N''371'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''黎巴嫩'',N''Lebanon'',N''961'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''莱索托'',N''Lesotho'',N''266'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''利比里亚'',N''Liberia'',N''231'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''利比亚'',N''Libya'',N''218'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''列支敦士登'',N''Liechtenstein'',N''423'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''立陶宛'',N''Lithuania'',N''370'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''卢森堡'',N''Luxembourg'',N''352'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''澳门'',N''Macao'',N''853'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''马达加斯加'',N''Madagascar'',N''261'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''马拉维'',N''Malawi'',N''265'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''马来西亚'',N''Malaysia'',N''60'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''马尔代夫'',N''Maldives'',N''960'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''马里'',N''Mali'',N''223'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''马耳他'',N''Malta'',N''356'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''马里亚那群岛'',N''Mariana Is'',N''1670'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''马提尼克'',N''Martinique'',N''596'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''毛里求斯'',N''Mauritius'',N''230'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''墨西哥'',N''Mexico'',N''52'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''摩尔多瓦'',N''Moldova'',N''373'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''摩纳哥'',N''Monaco'',N''377'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''蒙古'',N''Mongolia'',N''976'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''蒙特塞拉特岛'',N''Montserrat Is'',N''1664'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''摩洛哥'',N''Morocco'',N''212'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''莫桑比克'',N''Mozambique'',N''258'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''纳米比亚'',N''Namibia'',N''264'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''瑙鲁'',N''Nauru'',N''674'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''尼泊尔'',N''Nepal'',N''977'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''荷属安的列斯'',N''Netheriands Antilles'',N''599'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''荷兰'',N''Netherlands'',N''31'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''新西兰'',N''New Zealand'',N''64'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''尼加拉瓜'',N''Nicaragua'',N''505'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''尼日尔'',N''Niger'',N''227'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''尼日利亚'',N''Nigeria'',N''234'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''朝鲜'',N''North Korea'',N''850'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''挪威'',N''Norway'',N''47'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''阿曼'',N''Oman'',N''968'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''巴基斯坦'',N''Pakistan'',N''92'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''巴拿马'',N''Panama'',N''507'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''巴布亚新几内亚'',N''Papua New Cuinea'',N''675'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''巴拉圭'',N''Paraguay'',N''595'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''秘鲁'',N''Peru'',N''51'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''菲律宾'',N''Philippines'',N''63'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''波兰'',N''Poland'',N''48'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''葡萄牙'',N''Portugal'',N''351'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''波多黎各'',N''Puerto Rico'',N''1787'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''卡塔尔'',N''Qatar'',N''974'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''留尼旺'',N''Reunion'',N''262'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''罗马尼亚'',N''Romania'',N''40'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''俄罗斯'',N''Russia'',N''7'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''圣卢西亚'',N''Saint Lueia'',N''1758'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''圣文森特岛'',N''Saint Vincent'',N''1784'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''东萨摩亚(美)'',N''Samoa Eastern'',N''684'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''西萨摩亚'',N''Samoa Western'',N''685'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''圣马力诺'',N''San Marino'',N''378'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''圣多美和普林西比'',N''Sao Tome and Principe'',N''239'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''沙特阿拉伯'',N''Saudi Arabia'',N''966'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''塞内加尔'',N''Senegal'',N''221'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''塞舌尔'',N''Seychelles'',N''248'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''塞拉利昂'',N''Sierra Leone'',N''232'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''新加坡'',N''Singapore'',N''65'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''斯洛伐克'',N''Slovakia'',N''421'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''斯洛文尼亚'',N''Slovenia'',N''386'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''所罗门群岛'',N''Solomon Is'',N''677'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''索马里'',N''Somali'',N''252'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''南非'',N''South Africa'',N''27'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''西班牙'',N''Spain'',N''34'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''斯里兰卡'',N''SriLanka'',N''94'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''圣卢西亚'',N''St.Lucia'',N''1758'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''圣文森特'',N''St.Vincent'',N''1784'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''苏丹'',N''Sudan'',N''249'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''苏里南'',N''Suriname'',N''597'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''斯威士兰'',N''Swaziland'',N''268'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''瑞典'',N''Sweden'',N''46'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''瑞士'',N''Switzerland'',N''41'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''叙利亚'',N''Syria'',N''963'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''台湾（中国）'',N''Taiwan'',N''886'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''塔吉克斯坦'',N''Tajikstan'',N''992'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''坦桑尼亚'',N''Tanzania'',N''255'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''泰国'',N''Thailand'',N''66'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''多哥'',N''Togo'',N''228'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''汤加'',N''Tonga'',N''676'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''特立尼达和多巴哥'',N''Trinidad and Tobago'',N''1809'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''突尼斯'',N''Tunisia'',N''216'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''土耳其'',N''Turkey'',N''90'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''土库曼斯坦'',N''Turkmenistan'',N''993'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''乌干达'',N''Uganda'',N''256'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''乌克兰'',N''Ukraine'',N''380'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''阿拉伯联合酋长国'',N''United Arab Emirates'',N''971'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''英国'',N''United Kiongdom'',N''44'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''美国'',N''United States of America'',N''1'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''乌拉圭'',N''Uruguay'',N''598'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''乌兹别克斯坦'',N''Uzbekistan'',N''233'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''委内瑞拉'',N''Venezuela'',N''58'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''越南'',N''Vietnam'',N''84'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''也门'',N''Yemen'',N''967'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''南斯拉夫'',N''Yugoslavia'',N''381'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''津巴布韦'',N''Zimbabwe'',N''263'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''扎伊尔'',N''Zaire'',N''243'')';
execute immediate 'INSERT INTO YZMDCountry(Name,Name_en,IDDCode) VALUES(N''赞比亚'',N''Zambia'',N''260'')';
end if;
end;
/

--YZAppServiceContacts
declare
cnt number;
begin
select count(*) into cnt from USER_SEQUENCES where SEQUENCE_NAME='BPMSEQ_YZAPPSERVICECONTACTS';
if(cnt = 0) then
execute immediate 'create sequence BPMSEQ_YZAPPSERVICECONTACTS
minvalue 1 maxvalue 999999999999999999
start with 1 increment by 1 nocache';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'YZAPPSERVICECONTACTS';
if(cnt = 0) then
execute immediate 'CREATE TABLE YZAPPSERVICECONTACTS (
"ITEMID" NUMBER(10) NOT NULL,
"PRODUCT" NVARCHAR2(50) NULL,
"SERVICECENTER" NVARCHAR2(50) NULL,
"DESCRIPTION" NVARCHAR2(50) NULL,
"TEL" NVARCHAR2(50) NULL,
"ORDERINDEX" NUMBER(10) DEFAULT 0 NOT NULL
)';
execute immediate 'INSERT INTO YZAppServiceContacts(ItemID,Product,ServiceCenter,Tel,OrderIndex) VALUES(BPMSEQ_YZAPPSERVICECONTACTS.nextval,N''BPM'',N''总部客服'',N''021-67827788'',1)';
execute immediate 'INSERT INTO YZAppServiceContacts(ItemID,Product,ServiceCenter,Tel,OrderIndex) VALUES(BPMSEQ_YZAPPSERVICECONTACTS.nextval,N''BPM'',N''阳江基地'',N''010-33669988'',2)';
execute immediate 'INSERT INTO YZAppServiceContacts(ItemID,Product,ServiceCenter,Tel,OrderIndex) VALUES(BPMSEQ_YZAPPSERVICECONTACTS.nextval,N''BPM'',N''深圳分公司'',N''0755-78820889'',3)';
execute immediate 'INSERT INTO YZAppServiceContacts(ItemID,Product,ServiceCenter,Tel,OrderIndex) VALUES(BPMSEQ_YZAPPSERVICECONTACTS.nextval,N''BPM'',N''上海分公司'',N''021-87663389'',4)';
execute immediate 'INSERT INTO YZAppServiceContacts(ItemID,Product,ServiceCenter,Tel,OrderIndex) VALUES(BPMSEQ_YZAPPSERVICECONTACTS.nextval,N''BPM'',N''北京分公司'',N''010-67888996'',5)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_YZAPPSERVICECONTACTS';
if(cnt=0) then
execute immediate 'ALTER TABLE YZAPPSERVICECONTACTS ADD CONSTRAINT YZPK_YZAPPSERVICECONTACTS PRIMARY KEY(ITEMID)';
end if;
end;
/

--YZSysSMSValidation
declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'YZSYSSMSVALIDATION';
if(cnt = 0) then
execute immediate 'CREATE TABLE YZSYSSMSVALIDATION (
"ITEMGUID" NVARCHAR2(50) NOT NULL,
"IDDCODE" NVARCHAR2(10) NULL,
"PHONENUMBER" NVARCHAR2(20) NULL,
"VALIDATIONCODE" NVARCHAR2(20) NULL,
"EXPIREDATE" DATE NULL,
"CREATEDATE" DATE NULL,
"CREATEBY" NVARCHAR2(50) NULL
)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_YZSYSSMSVALIDATION';
if(cnt=0) then
execute immediate 'ALTER TABLE YZSYSSMSVALIDATION ADD CONSTRAINT YZPK_YZSYSSMSVALIDATION PRIMARY KEY(ITEMGUID)';
end if;
end;
/

/**********************app内置应用***********************/
--iDailyReport
declare
cnt number;
begin
select count(*) into cnt from USER_SEQUENCES where SEQUENCE_NAME='BPMSEQ_IDAILYREPORT';
if(cnt = 0) then
execute immediate 'create sequence BPMSEQ_IDAILYREPORT
minvalue 1 maxvalue 999999999999999999
start with 1 increment by 1 nocache';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'IDAILYREPORT';
if(cnt = 0) then
execute immediate 'CREATE TABLE IDAILYREPORT (
"ITEMID" NUMBER(10) NOT NULL,
"TASKID" NUMBER(10) NOT NULL,
"SN" NVARCHAR2(50) NULL,
"ACCOUNT" NVARCHAR2(50) NULL,
"DATE" DATE NULL,
"DONE" NVARCHAR2(200) NULL,
"UNDONE" NVARCHAR2(200) NULL,
"COORDINATE" NVARCHAR2(200) NULL,
"COMMENTS" NVARCHAR2(200) NULL,
"PICS" NVARCHAR2(100) NULL,
"ATTACHMENTS" NVARCHAR2(100) NULL,
"CREATEAT" DATE NULL
)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_IDAILYREPORTS';
if(cnt=0) then
execute immediate 'ALTER TABLE IDAILYREPORT ADD CONSTRAINT YZPK_IDAILYREPORTS PRIMARY KEY(ITEMID)';
end if;
end;
/

--iWeeklyReport
declare
cnt number;
begin
select count(*) into cnt from USER_SEQUENCES where SEQUENCE_NAME='BPMSEQ_IWEEKLYREPORT';
if(cnt = 0) then
execute immediate 'create sequence BPMSEQ_IWEEKLYREPORT
minvalue 1 maxvalue 999999999999999999
start with 1 increment by 1 nocache';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'IWEEKLYREPORT';
if(cnt = 0) then
execute immediate 'CREATE TABLE IWEEKLYREPORT (
"ITEMID" NUMBER(10) NOT NULL,
"TASKID" NUMBER(10) NOT NULL,
"SN" NVARCHAR2(50) NULL,
"ACCOUNT" NVARCHAR2(50) NULL,
"DATE" DATE NULL,
"DONE" NVARCHAR2(200) NULL,
"UNDONE" NVARCHAR2(200) NULL,
"COORDINATE" NVARCHAR2(200) NULL,
"COMMENTS" NVARCHAR2(200) NULL,
"PICS" NVARCHAR2(100) NULL,
"ATTACHMENTS" NVARCHAR2(100) NULL,
"CREATEAT" DATE NULL
)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_IWEEKLYREPORT';
if(cnt=0) then
execute immediate 'ALTER TABLE IWEEKLYREPORT ADD CONSTRAINT YZPK_IWEEKLYREPORT PRIMARY KEY(ITEMID)';
end if;
end;
/

--iMonthlyReport
declare
cnt number;
begin
select count(*) into cnt from USER_SEQUENCES where SEQUENCE_NAME='BPMSEQ_IMONTHLYREPORT';
if(cnt = 0) then
execute immediate 'create sequence BPMSEQ_IMONTHLYREPORT
minvalue 1 maxvalue 999999999999999999
start with 1 increment by 1 nocache';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'IMONTHLYREPORT';
if(cnt = 0) then
execute immediate 'CREATE TABLE IMONTHLYREPORT (
"ITEMID" NUMBER(10) NOT NULL,
"TASKID" NUMBER(10) NOT NULL,
"SN" NVARCHAR2(50) NULL,
"ACCOUNT" NVARCHAR2(50) NULL,
"DATE" DATE NULL,
"DONE" NVARCHAR2(200) NULL,
"UNDONE" NVARCHAR2(200) NULL,
"COORDINATE" NVARCHAR2(200) NULL,
"COMMENTS" NVARCHAR2(200) NULL,
"PICS" NVARCHAR2(100) NULL,
"ATTACHMENTS" NVARCHAR2(100) NULL,
"CREATEAT" DATE NULL
)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_IMONTHLYREPORT';
if(cnt=0) then
execute immediate 'ALTER TABLE IMONTHLYREPORT ADD CONSTRAINT YZPK_IMONTHLYREPORT PRIMARY KEY(ITEMID)';
end if;
end;
/

--YZAppNotesBarcode
declare
cnt number;
begin
select count(*) into cnt from USER_SEQUENCES where SEQUENCE_NAME='BPMSEQ_YZAPPNOTESBARCODE';
if(cnt = 0) then
execute immediate 'create sequence BPMSEQ_YZAPPNOTESBARCODE
minvalue 1 maxvalue 999999999999999999
start with 1 increment by 1 nocache';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'YZAPPNOTESBARCODE';
if(cnt = 0) then
execute immediate 'CREATE TABLE YZAPPNOTESBARCODE (
"ITEMID" NUMBER(10) NOT NULL,
"ACCOUNT" NVARCHAR2(50) NOT NULL,
"BARCODE" NVARCHAR2(100) NOT NULL,
"FORMAT" NVARCHAR2(30) NULL,
"PRODUCTNAME" NVARCHAR2(200) NULL,
"COMMENTS" NVARCHAR2(200) NULL,
"CREATEAT" DATE NOT NULL
)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_YZAPPNOTESBARCODE';
if(cnt=0) then
execute immediate 'ALTER TABLE YZAPPNOTESBARCODE ADD CONSTRAINT YZPK_YZAPPNOTESBARCODE PRIMARY KEY(ITEMID)';
end if;
end;
/

--YZAppNotesCash
declare
cnt number;
begin
select count(*) into cnt from USER_SEQUENCES where SEQUENCE_NAME='BPMSEQ_YZAPPNOTESCASH';
if(cnt = 0) then
execute immediate 'create sequence BPMSEQ_YZAPPNOTESCASH
minvalue 1 maxvalue 999999999999999999
start with 1 increment by 1 nocache';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'YZAPPNOTESCASH';
if(cnt = 0) then
execute immediate 'CREATE TABLE YZAPPNOTESCASH (
"ITEMID" NUMBER(10) NOT NULL,
"ACCOUNT" NVARCHAR2(50) NOT NULL,
"TYPE" NVARCHAR2(50) NOT NULL,
"DATE" DATE NULL,
"AMOUNT" NUMBER(10,2) NOT NULL,
"INVOICE" NVARCHAR2(200) NULL,
"COMMENTS" NVARCHAR2(200) NULL,
"CREATEAT" DATE NULL
)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_YZAPPNOTESCASH';
if(cnt=0) then
execute immediate 'ALTER TABLE YZAPPNOTESCASH ADD CONSTRAINT YZPK_YZAPPNOTESCASH PRIMARY KEY(ITEMID)';
end if;
end;
/

--YZAppNotesFootmark
declare
cnt number;
begin
select count(*) into cnt from USER_SEQUENCES where SEQUENCE_NAME='BPMSEQ_YZAPPNOTESFOOTMARK';
if(cnt = 0) then
execute immediate 'create sequence BPMSEQ_YZAPPNOTESFOOTMARK
minvalue 1 maxvalue 999999999999999999
start with 1 increment by 1 nocache';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'YZAPPNOTESFOOTMARK';
if(cnt = 0) then
execute immediate 'CREATE TABLE YZAPPNOTESFOOTMARK (
"ITEMID" NUMBER(10) NOT NULL,
"ACCOUNT" NVARCHAR2(50) NOT NULL,
"TIME" DATE NOT NULL,
"RAWLAT" NUMBER(12,8) NOT NULL,
"RAWLON" NUMBER(12,8) NOT NULL,
"LAT" NUMBER(12,8) NOT NULL,
"LON" NUMBER(12,8) NOT NULL,
"LOCID" NVARCHAR2(50) NOT NULL,
"LOCNAME" NVARCHAR2(50) NOT NULL,
"LOCADDRESS" NVARCHAR2(300) NOT NULL,
"CONTACT" NVARCHAR2(25) NULL,
"COMMENTS" NVARCHAR2(200) NULL,
"ATTACHMENTS" NVARCHAR2(200) NULL,
"DATE" DATE NOT NULL
)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_YZAPPNOTESFOOTMARK';
if(cnt=0) then
execute immediate 'ALTER TABLE YZAPPNOTESFOOTMARK ADD CONSTRAINT YZPK_YZAPPNOTESFOOTMARK PRIMARY KEY(ITEMID)';
end if;
end;
/

--YZAppNotesSpeak
declare
cnt number;
begin
select count(*) into cnt from USER_SEQUENCES where SEQUENCE_NAME='BPMSEQ_YZAPPNOTESSPEAK';
if(cnt = 0) then
execute immediate 'create sequence BPMSEQ_YZAPPNOTESSPEAK
minvalue 1 maxvalue 999999999999999999
start with 1 increment by 1 nocache';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'YZAPPNOTESSPEAK';
if(cnt = 0) then
execute immediate 'CREATE TABLE YZAPPNOTESSPEAK (
"ITEMID" NUMBER(10) NOT NULL,
"ACCOUNT" NVARCHAR2(50) NOT NULL,
"FILEID" NVARCHAR2(50) NOT NULL,
"DURATION" NUMBER(10) NOT NULL,
"COMMENTS" NVARCHAR2(200) NULL,
"CREATEAT" DATE NULL
)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_YZAPPNOTESSPEAK';
if(cnt=0) then
execute immediate 'ALTER TABLE YZAPPNOTESSPEAK ADD CONSTRAINT YZPK_YZAPPNOTESSPEAK PRIMARY KEY(ITEMID)';
end if;
end;
/

--YZMDExpenseType
declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'YZMDEXPENSETYPE';
if(cnt = 0) then
execute immediate 'CREATE TABLE YZMDEXPENSETYPE (
"CODE" NVARCHAR2(50) NOT NULL,
"TEXT" NVARCHAR2(50) NULL,
"NAMESPACE" NVARCHAR2(30) NULL,
"IMAGE" NVARCHAR2(50) NULL,
"ORDERINDEX" NUMBER(10) NULL
)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A01'', N''飞机'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A01.png'', 1)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A02'', N''火车'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A02.png'', 2)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A03'', N''长途客车'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A03.png'', 3)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A04'', N''市内交通'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A04.png'', 4)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A05'', N''住宿'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A05.png'', 5)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A06'', N''餐饮'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A06.png'', 6)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A07'', N''补贴'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A07.png'', 7)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A08'', N''交际'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A08.png'', 8)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A09'', N''办公'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A09.png'', 9)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A10'', N''通讯'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A10.png'', 10)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A11'', N''水电'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A11.png'', 11)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A12'', N''招聘'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A12.png'', 12)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A13'', N''咨询'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A13.png'', 13)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A14'', N''房租'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A14.png'', 14)';
execute immediate 'INSERT INTO YZMDExpenseType(Code, Text, NameSpace, Image, OrderIndex) VALUES (N''A15'', N''其他'', N''YZSoft$Local'', N''YZSoft$Local/resources/images/expense/A15.png'', 15)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_YZMDEXPENSETYPE';
if(cnt=0) then
execute immediate 'ALTER TABLE YZMDEXPENSETYPE ADD CONSTRAINT YZPK_YZMDEXPENSETYPE PRIMARY KEY(CODE)';
end if;
end;
/

--YZMDLeavingType
declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'YZMDLEAVINGTYPE';
if(cnt = 0) then
execute immediate 'CREATE TABLE YZMDLEAVINGTYPE (
"TYPECODE" NVARCHAR2(50) NOT NULL,
"NAME" NVARCHAR2(50) NULL,
"ORDERINDEX" NUMBER(10) NULL
)';
execute immediate 'INSERT INTO YZMDLeavingType(TypeCode, Name, OrderIndex) VALUES (N''Absence'', N''事假'', 3)';
execute immediate 'INSERT INTO YZMDLeavingType(TypeCode, Name, OrderIndex) VALUES (N''Annual'', N''年假'', 1)';
execute immediate 'INSERT INTO YZMDLeavingType(TypeCode, Name, OrderIndex) VALUES (N''Marital'', N''婚假'', 5)';
execute immediate 'INSERT INTO YZMDLeavingType(TypeCode, Name, OrderIndex) VALUES (N''Maternity'', N''产假'', 6)';
execute immediate 'INSERT INTO YZMDLeavingType(TypeCode, Name, OrderIndex) VALUES (N''Other'', N''其他'', 9)';
execute immediate 'INSERT INTO YZMDLeavingType(TypeCode, Name, OrderIndex) VALUES (N''Overtime'', N''调休'', 2)';
execute immediate 'INSERT INTO YZMDLeavingType(TypeCode, Name, OrderIndex) VALUES (N''Paternity'', N''陪产假'', 7)';
execute immediate 'INSERT INTO YZMDLeavingType(TypeCode, Name, OrderIndex) VALUES (N''Road'', N''路途假'', 8)';
execute immediate 'INSERT INTO YZMDLeavingType(TypeCode, Name, OrderIndex) VALUES (N''Sick'', N''病假'', 4)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_YZMDLEAVINGTYPE';
if(cnt=0) then
execute immediate 'ALTER TABLE YZMDLEAVINGTYPE ADD CONSTRAINT YZPK_YZMDLEAVINGTYPE PRIMARY KEY(TYPECODE)';
end if;
end;
/

--YZMDProduct
declare
cnt number;
begin
select count(*) into cnt from USER_SEQUENCES where SEQUENCE_NAME='BPMSEQ_YZMDPRODUCT';
if(cnt = 0) then
execute immediate 'create sequence BPMSEQ_YZMDPRODUCT
minvalue 1 maxvalue 999999999999999999
start with 1 increment by 1 nocache';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'YZMDPRODUCT';
if(cnt = 0) then
execute immediate 'CREATE TABLE YZMDPRODUCT (
"PRODUCTID" NUMBER(10) NOT NULL,
"BARCODE" NVARCHAR2(100) NULL,
"FORMAT" NVARCHAR2(50) NULL,
"PRODUCTNAME" NVARCHAR2(200) NULL
)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_YZMDPRODUCT';
if(cnt=0) then
execute immediate 'ALTER TABLE YZMDPRODUCT ADD CONSTRAINT YZPK_YZMDPRODUCT PRIMARY KEY(PRODUCTID)';
end if;
end;
/

--YZMDProjects
declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'YZMDPROJECTS';
if(cnt = 0) then
execute immediate 'CREATE TABLE YZMDPROJECTS (
"PROJECTCODE" NVARCHAR2(50) NOT NULL,
"PROJECTNAME" NVARCHAR2(50) NULL,
"ORDERINDEX" NUMBER(10) NULL
)';
execute immediate 'INSERT INTO YZMDProjects(ProjectCode, ProjectName, OrderIndex) VALUES (N''001'', N''公司'', 1)';
execute immediate 'INSERT INTO YZMDProjects(ProjectCode, ProjectName, OrderIndex) VALUES (N''002'', N''BPM'', 2)';
execute immediate 'INSERT INTO YZMDProjects(ProjectCode, ProjectName, OrderIndex) VALUES (N''003'', N''BPA'', 3)';
execute immediate 'INSERT INTO YZMDProjects(ProjectCode, ProjectName, OrderIndex) VALUES (N''004'', N''市场营销'', 4)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_YZMDPROJECTS';
if(cnt=0) then
execute immediate 'ALTER TABLE YZMDPROJECTS ADD CONSTRAINT YZPK_YZMDPROJECTS PRIMARY KEY(PROJECTCODE)';
end if;
end;
/

/*********************app相关流程**********************/
--iDemoAppFields
declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'IDEMOAPPFIELDS';
if(cnt = 0) then
execute immediate 'CREATE TABLE IDEMOAPPFIELDS (
"TASKID" NUMBER(10) NULL,
"TEXT" NVARCHAR2(50) NULL,
"NUMBER" NUMBER(10,2) NULL,
"TEXTAREA" NVARCHAR2(50) NULL,
"DATEPICKER" DATE NULL,
"SELECT" NVARCHAR2(50) NULL,
"IMAGEATTACHMENT" NVARCHAR2(200) NULL,
"ATTACHMENT" NVARCHAR2(200) NULL,
"CHECKBOX1" NVARCHAR2(50) NULL,
"CHECKBOX2" NUMBER(1) NULL,
"RADIO" NVARCHAR2(50) NULL,
"TOGGLE1" NUMBER(1) NULL,
"TOGGLE2" NUMBER(1) NULL,
"YEARPICKER" DATE NULL,
"MONTHPICKER" DATE NULL,
"WEEKPICKER" DATE NULL,
"TIMEPICKER" DATE NULL,
"EXPANDICONSELECT" NVARCHAR2(50) NULL,
"EMAIL" NVARCHAR2(50) NULL,
"PASSWORD" NVARCHAR2(50) NULL,
"USERS" NVARCHAR2(200) NULL,
"SINGLEUSER" NVARCHAR2(50) NULL
)';
end if;
end;
/

--iDemoBusinessTrip
declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'IDEMOBUSINESSTRIP';
if(cnt = 0) then
execute immediate 'CREATE TABLE IDEMOBUSINESSTRIP (
"TASKID" NUMBER(10) NOT NULL,
"SN" NVARCHAR2(50) NULL,
"TYPE" NVARCHAR2(50) NULL,
"FROM" DATE NULL,
"TO" DATE NULL,
"DAYS" NUMBER(10,2) NULL,
"COMMENTS" NVARCHAR2(500) NULL,
"ATTACHMENTS" NVARCHAR2(100) NULL
)';
end if;
end;
/

--iDemoExpense
declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'IDEMOEXPENSE';
if(cnt = 0) then
execute immediate 'CREATE TABLE IDEMOEXPENSE (
"TASKID" NUMBER(10) NOT NULL,
"SN" NVARCHAR2(50) NULL,
"TITLE" NVARCHAR2(50) NULL,
"AMOUNT" NUMBER(10,2) NULL,
"COMMENTS" NVARCHAR2(200) NULL,
"ATTACHMENTS" NVARCHAR2(100) NULL
)';
end if;
end;
/

--iDemoExpenseDetail
declare
cnt number;
begin
select count(*) into cnt from USER_SEQUENCES where SEQUENCE_NAME='BPMSEQ_IDEMOEXPENSEDETAIL';
if(cnt = 0) then
execute immediate 'create sequence BPMSEQ_IDEMOEXPENSEDETAIL
minvalue 1 maxvalue 999999999999999999
start with 1 increment by 1 nocache';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'IDEMOEXPENSEDETAIL';
if(cnt = 0) then
execute immediate 'CREATE TABLE IDEMOEXPENSEDETAIL (
"ITEMID" NUMBER(10) NOT NULL,
"TASKID" NUMBER(10) NOT NULL,
"DATE" DATE NULL,
"PROJECTCODE" NVARCHAR2(50) NULL,
"TYPECODE" NVARCHAR2(50) NULL,
"AMOUNT" NUMBER(10,2) NULL,
"COMMENTS" NVARCHAR2(100) NULL
)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from user_indexes where INDEX_NAME='YZPK_IDEMOEXPENSEDETAIL';
if(cnt=0) then
execute immediate 'ALTER TABLE IDEMOEXPENSEDETAIL ADD CONSTRAINT YZPK_IDEMOEXPENSEDETAIL PRIMARY KEY(ITEMID)';
end if;
end;
/

--iDemoLeaving
declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'IDEMOLEAVING';
if(cnt = 0) then
execute immediate 'CREATE TABLE IDEMOLEAVING (
"TASKID" NUMBER(10) NOT NULL,
"SN" NVARCHAR2(50) NULL,
"LEAVETYPE" NVARCHAR2(50) NULL,
"LEAVEFROM" DATE NULL,
"LEAVETO" DATE NULL,
"DAYS" NUMBER(10,2) NULL,
"COMMENTS" NVARCHAR2(500) NULL,
"ATTACHMENTS" NVARCHAR2(100) NULL
)';
end if;
end;
/

--iDemoOutside
declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'IDEMOOUTSIDE';
if(cnt = 0) then
execute immediate 'CREATE TABLE IDEMOOUTSIDE (
"TASKID" NUMBER(10) NOT NULL,
"SN" NVARCHAR2(50) NULL,
"TYPE" NVARCHAR2(50) NULL,
"FROM" DATE NULL,
"TO" DATE NULL,
"DAYS" NUMBER(10,2) NULL,
"COMMENTS" NVARCHAR2(500) NULL,
"ATTACHMENTS" NVARCHAR2(100) NULL
)';
end if;
end;
/

--iDemoFeedback
declare
cnt number;
begin
select count(*) into cnt from user_tables where table_name = 'IDEMOFEEDBACK';
if(cnt = 0) then
execute immediate 'CREATE TABLE IDEMOFEEDBACK (
"TASKID" NUMBER(10) NULL,
"SN" NVARCHAR2(50) NULL,
"DATE" DATE NULL,
"TITLE" NVARCHAR2(50) NULL,
"COMMENTS" NVARCHAR2(50) NULL,
"ATTACHMENTS" NVARCHAR2(50) NULL
)';
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from BPMSysMobileAppFormFields where XClass = N'YZSoft.src.field.ExpandIconSelect';
if(cnt=0) then
delete from BPMSysMobileAppFormFields;
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'Ext.field.Text',N'Text',1);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'Ext.field.Number',N'Number',2);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'Ext.field.TextArea',N'TextArea',3);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'Ext.field.Field',N'Display',4);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'YZSoft.src.field.DatePicker',N'DatePicker',5);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'YZSoft.src.field.Select',N'Select',6);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'YZSoft.src.field.ImageAttachment',N'ImageAttachment',7);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'YZSoft.src.field.Attachment',N'Attachment',8);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'Ext.field.Checkbox',N'Checkbox',9);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'Ext.field.Radio',N'Radio',10);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'Ext.field.Toggle',N'Toggle',11);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'YZSoft.src.field.YearPicker',N'YearPicker',12);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'YZSoft.src.field.MonthPicker',N'MonthPicker',13);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'YZSoft.src.field.WeekPicker',N'WeekPicker',14);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'YZSoft.src.field.TimePicker',N'TimePicker',15);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'YZSoft.src.field.ExpandIconSelect',N'ExpandIconSelect',16);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'YZSoft.src.field.Users',N'Users',17);
INSERT INTO BPMSysMobileAppFormFields(XClass,"DESC",OrderIndex) VALUES(N'Ext.field.Email',N'Email',18);
end if;
end;
/

declare
cnt number;
begin
select count(*) into cnt from USER_TAB_COLUMNS WHERE TABLE_NAME='IDEMOAPPFIELDS' AND COLUMN_NAME='CHECKBOX3';
if(cnt=0) then
execute immediate 'alter table IDEMOAPPFIELDS add(CHECKBOX3 NVARCHAR2(50))';
end if;
end;
/