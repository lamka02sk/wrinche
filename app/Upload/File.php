<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * File Manager
 * Version: 0.4.4
 * Authors: lamka02sk
 */

namespace App\Upload;

use App\Database\QueryBuilder;
use App\Errors\UserEvents;
use App\Helpers\Config;

class File {

    public $data;
    public $extension;
    public $destination = '';

    public $supportedExtensions = [

        // Video
        '3gp',
        'avi',
        'flv',
        'h264',
        'mkv',
        'm4v',
        'mov',
        'mp4',
        'mpeg',
        'ogv',
        'swf',
        'vob',
        'webm',
        'wmv',

        // Audio
        'aac',
        'aiff',
        'flac',
        'm4a',
        'm4b',
        'midi',
        'mp3',
        'ogg',
        'wav',
        'wma',

        // Image
        'bmp',
        'gif',
        'jpeg',
        'jpg',
        'jif',
        'jpe',
        'png',
        //'webp',
        'svg',

        // RAW Photos
        'arw',
        'crw',
        'cr2',
        'dcr',
        'dng',
        'mrw',
        'nef',
        'orf',
        'ptx',
        'raf',
        'raw',
        'rw2',

        // Vector graphics
        'ai',
        'cdr',
        'csh',
        'csl',
        'drw',
        'odg',
        'sda',

        // Graphics formats
        'abr',
        'cdt',
        'eps',
        'fla',
        'psd',

        // 3D graphics
        '3d',
        '3ds',
        'c4d',
        'dwg',
        'dxf',
        'ipt',
        'max',
        'skp',
        'stl',
        'u3d',

        // Fonts
        'eot',
        'otf',
        'ttf',
        'woff',

        // Documents
        'abw',
        'doc',
        'docm',
        'docx',
        'dot',
        'dotm',
        'dotx',
        'epub',
        'ind',
        'indd',
        'odf',
        'ods',
        'odt',
        'ott',
        'pages',
        'pdf',
        'pot',
        'potx',
        'pps',
        'ppsx',
        'ppt',
        'pptm',
        'pptx',
        'prproj',
        'ps',
        'pub',
        'rtf',
        'sdd',
        'sdw',
        'snp',
        'sxw',
        'wpd',
        'wps',
        'xps',

        // Text files
        'application',
        'asp',
        'csv',
        //'htm',
        //'html',
        'log',
        'nfo',
        'reg',
        'srt',
        'sub',
        'text',
        'txt',
        'xml',
        'tmp',
        'md',
        'sql',

        // E-book files
        'azw',
        'azw3',
        'azw4',
        'fb2',
        'iba',
        'ibooks',
        'lit',
        'mobi',

        // Spreadsheets
        'numbers',

        // Office
        'accdb',
        'accdt',
        'mdb',
        'one',
        'onepkg',
        'pst',

        // Games
        'big',
        'dat',
        'dds',
        'pak',
        'res',
        'sav',
        'save',
        'uax',
        'rom',

        // Virtualization
        'ova',
        'ovf',
        'pvm',
        'vdi',
        'vhd',
        'vmdk',
        'vmem',
        'vmx',

        // Internet
        'aspx',
        'atom',
        'bc',
        'class',
        'crdownload',
        'css',
        'download',
        'gdoc',
        'gsheet',
        'gslides',
        'js',
        'json',
        'jsp',
        'part',
        'rss',
        'torrent',

        // E-mail
        'dbx',
        'eml',
        'msg',
        'vcf',

        // Executables
        'exe',
        'bat',
        'com',
        'gadget',
        'lnk',
        'msi',
        'prg',
        'scr',
        'vbs',
        'bin',
        'dll',
        'drv',
        'jar',
        'ocx',
        'sys',
        'deb',
        'rpm',
        'dmg',

        // Archives
        '7z',
        '7zip',
        'gz',
        'gzip',
        'pkg',
        'rar',
        'tar',
        'tgz',
        'zip',

        // Backup
        'bak',
        'bkp',
        'iso',
        'old',

        // Disk images
        'img',
        'vcd',
        'tc',
        'mdf',
        'mds',

        // Phone formats
        'apk',
        'asec',
        'crypt',
        'ipa',
        'ipsw',
        'lqm',
        'mdbackup',
        'nomedia',
        'pkpass',
        'rsc',
        'sbf',
        'tpk',

        // Other
        'map',
        'kml',
        'gpx',
        'swp',
        'dump',
        'crx',
        'plugin',
        'safariextz',
        'xpi',
        'asm',
        'java',
        'rc',
        'lib',
        'src',
        'xcodeproj',
        'cfg',
        'config',
        'ini',
        'cal',
        '3dr',
        'md5',
        'rep',
        'ref'

    ];

    public $supportedFormats = [

        // Video
        '3gp' => [
            'video/3gpp',
            'video/3gpp-tt'
        ],
        'avi' => [
            'video/avi',
            'video/msvideo',
            'video/x-msvideo',
            'video/vnd.avi'
        ],
        'flv' => [
            'video/x-flv',
            'video/mp4'
        ],
        'h264' => [
            'video/h264'
        ],
        'mkv' => [
            'video/x-matroska'
        ],
        'm4v' => [
            'video/mp4',
            'video/x-m4v'
        ],
        'mov' => [
            'video/quicktime'
        ],
        'mp4' => [
            'video/mp4'
        ],
        'mpeg' => [
            'video/mpeg'
        ],
        'ogv' => [
            'video/ogg'
        ],
        'swf' => [
            'video/x-flv',
            'video/mp4'
        ],
        'vob' => [
            'video/dvd',
            'video/mpeg',
            'video/x-ms-vob'
        ],
        'webm' => [
            'video/webm',
            'audio/webm'
        ],
        'wmv' => [
            'video/x-ms-wmv'
        ],

        // Audio
        'aac' => [
            'audio/aac',
            'audio/aacp',
            'audio/3gpp',
            'audio/3gpp2',
            'audio/mp4',
            'audio/mp4a-latm',
            'audio/mpeg4-generic'
        ],
        'aiff' => [
            'audio/aiff',
            'audio/x-aiff'
        ],
        'flac' => [
            'audio/x-flac'
        ],
        'm4a' => [
            'audio/mp4'
        ],
        'm4b' => [
            'audio/x-m4b'
        ],
        'midi' => [
            'audio/midi',
            'audio/x-midi'
        ],
        'mp3' => [
            'audio/mpeg',
            'audio/mp3',
            'audio/MPA',
            'audio/mpa',
            'audio/mpa-robust'
        ],
        'ogg' => [
            'audio/ogg'
        ],
        'wav' => [
            'audio/vnd.wave',
            'audio/wav',
            'audio/wave',
            'audio/x-wav'
        ],
        'wma' => [
            'audio/x-ms-wma'
        ],

        // Images
        'bmp' => [
            'image/bmp',
            'image/x-bmp',
            'image/x-ms-bmp',
            'image/x-windows-bmp'
        ],
        'gif' => [
            'image/gif'
        ],
        'jpeg' => [
            'image/jpeg',
            'image/pjpeg'
        ],
        'jpg' => [
            'image/jpeg',
            'image/pjpeg'
        ],
        'jif' => [
            'image/jpeg',
            'image/pjpeg'
        ],
        'jpe' => [
            'image/jpeg',
            'image/pjpeg'
        ],
        'png' => [
            'image/png'
        ],
        /*'webp' => [
            'image/webp'
        ],*/
        'svg' => [
            'image/svg+xml'
        ],

        // RAW Photos
        'arw' => [
            'image/x-raw'
        ],
        'crw' => [
            'image/x-raw'
        ],
        'cr2' => [
            'image/x-raw'
        ],
        'dcr' => [
            'image/x-raw',
            'application/octet-stream',
            'application/x-director'
        ],
        'dng' => [
            'image/dng'
        ],
        'mrw' => [
            'image/x-raw'
        ],
        'nef' => [
            'image/x-raw',
            'application/octet-stream',
            'image/x-nikon-nef'
        ],
        'orf' => [
            'image/x-raw'
        ],
        'ptx' => [
            'image/x-raw',
            'application/octet-stream',
            'image/x-pef'
        ],
        'raf' => [
            'image/x-raw'
        ],
        'raw' => [
            'image/x-raw',
            'image/raw'
        ],
        'rw2' => [
            'image/x-raw'
        ],

        // Vector graphics
        'ai' => [
            'application/postscript'
        ],
        'cdr' => [
            'image/x-coreldraw'
        ],
        'csh' => [
            'application/x-photoshop'
        ],
        'csl' => [
            'application/octet-stream'
        ],
        'drw' => [
            'application/x-mgx-designer'
        ],
        'odg' => [
            'application/vnd.oasis.opendocument.graphics',
            'application/octet-stream'
        ],
        'sda' => [
            'application/vnd.stardivision.draw'
        ],

        // Graphics formats
        'abr' => [
            'application/x-photoshop'
        ],
        'cdt' => [
            'application/x-cdt',
            'application/octet-stream'
        ],
        'eps' => [
            'image/x-eps'
        ],
        'fla' => [
            'application/octet-stream'
        ],
        'psd' => [
            'image/vnd.adobe.photoshop',
            'application/x-photoshop'
        ],

        // 3D graphics
        '3d' => [
            'application/octet-stream'
        ],
        '3ds' => [
            'application/x-3ds'
        ],
        'c4d' => [
            'application/octet-stream'
        ],
        'dwg' => [
            'application/x-autocad'
        ],
        'dxf' => [
            'application/x-dxf',
            'application/dec-dx'
        ],
        'ipt' => [
            'image/x-ipt',
            'application/octet-stream'
        ],
        'max' => [
            'application/x-paperport',
            'application/octet-stream'
        ],
        'skp' => [
            'application/vnd.sketchup.skp'
        ],
        'stl' => [
            'application/octet-stream'
        ],
        'u3d' => [
            'model/u3d'
        ],

        // Fonts
        'eot' => [
            'application/octet-stream'
        ],
        'otf' => [
            'application/vnd.ms-opentype',
            ''
        ],
        'ttf' => [
            'application/x-font-ttf',
            'application/octet-stream'
        ],
        'woff' => [
            'application/font-woff'
        ],

        // Documents
        'abw' => [
            'application/abiword'
        ],
        'doc' => [
            'application/msword'
        ],
        'docm' => [
            'application/vnd.openxmlformats'
        ],
        'docx' => [
            'application/vnd.openxmlformats',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ],
        'dot' => [
            'application/msword',
            'application/octet-stream'
        ],
        'dotm' => [
            'application/vnd.openxmlformats'
        ],
        'dotx' => [
            'application/vnd.openxmlformats'
        ],
        'epub' => [
            'application/octet-stream'
        ],
        'ind' => [
            'application/x-latex',
            'text/plain',
            'application/octet-stream'
        ],
        'indd' => [
            'application/octet-stream'
        ],
        'odf' => [
            'application/vnd.oasis.opendocument.formula'
        ],
        'ods' => [
            'application/vnd.oasis.opendocument.spreadsheet'
        ],
        'odt' => [
            'application/vnd.oasis.opendocument.text'
        ],
        'ott' => [
            'application/vnd.oasis.opendocument.formula-template'
        ],
        'pages' => [
            'application/x-iwork-pages-sffpages'
        ],
        'pdf' => [
            'application/pdf'
        ],
        'pot' => [
            'application/mspowerpoint'
        ],
        'potx' => [
            'application/vnd.ms-powerpoint.template'
        ],
        'pps' => [
            'application/mspowerpoint'
        ],
        'ppsx' => [
            'application/vnd.ms-powerpoint'
        ],
        'ppt' => [
            'application/mspowerpoint'
        ],
        'pptx' => [
            'application/vnd.openxmlformats'
        ],
        'pptm' => [
            'application/vnd.openxmlformats'
        ],
        'prproj' => [
            'application/octet-stream'
        ],
        'ps' => [
            'application/postscript'
        ],
        'pub' => [
            'application/x-pub',
            'application/vnd.ms-publisher'
        ],
        'rtf' => [
            'application/rtf'
        ],
        'sdd' => [
            'application/vnd.stardivision.impress'
        ],
        'sdw' => [
            'application/vnd.stardivision.writer'
        ],
        'snp' => [
            'application/vnd.ms-access',
            'application/octet-stream'
        ],
        'sxw' => [
            'application/vnd.sun.xml.writer',
            'application/octet-stream'
        ],
        'wpd' => [
            'application/octet-stream'
        ],
        'wps' => [
            'application/vnd.ms-works'
        ],
        'xps' => [
            'application/vnd.ms-xpsdocument',
            'application/octet-stream'
        ],

        // Text files
        'application' => [
            'application/octet-stream'
        ],
        'asp' => [
            'text/plain'
        ],
        'csv' => [
            'text/plain',
            'text/csv'
        ],
        /*'htm' => [
            'text/plain',
            'text/html'
        ],
        'html' => [
            'text/plain',
            'text/html'
        ],*/
        'log' => [
            'text/plain'
        ],
        'nfo' => [
            'text/plain',
            'application/octet-stream'
        ],
        'reg' => [
            'application/octet-stream'
        ],
        'srt' => [
            'text/plain',
            'application/octet-stream'
        ],
        'sub' => [
            'text/plain',
            'application/octet-stream'
        ],
        'text' => [
            'text/plain'
        ],
        'txt' => [
            'text/plain'
        ],
        'xml' => [
            'text/plain',
            'text/xml'
        ],
        'tmp' => [
            'application/octet-stream'
        ],
        'md' => [
            'application/octet-stream',
            'text/markdown'
        ],

        // E-book files
        'azw' => [
            'application/octet-stream'
        ],
        'azw3' => [
            'application/octet-stream'
        ],
        'azw4' => [
            'application/octet-stream'
        ],
        'fb2' => [
            'text/xml'
        ],
        'iba' => [
            'application/octet-stream'
        ],
        'ibooks' => [
            'application/octet-stream'
        ],
        'lit' => [
            'application/x-ms-reader'
        ],
        'mobi' => [
            'application/x-mobipocket'
        ],

        // Spreadsheets
        'numbers' => [
            'application/octet-stream'
        ],

        // Office
        'accdb' => [
            'application/msaccess'
        ],
        'accdt' => [
            'application/msaccess'
        ],
        'mdb' => [
            'application/vnd.ms-access',
            'application/octet-stream'
        ],
        'one' => [
            'application/onenote'
        ],
        'onepkg' => [
            'application/onenote'
        ],
        'pst' => [
            'application/octet-stream'
        ],

        // Games
        'big' => [
            'application/octet-stream'
        ],
        'dat' => [
            'application/octet-stream'
        ],
        'dds' => [
            'image/x-dds',
            'application/octet-stream'
        ],
        'pak' => [
            'application/octet-stream'
        ],
        'res' => [
            'application/octet-stream'
        ],
        'sav' => [
            'application/octet-stream'
        ],
        'save' => [
            'application/octet-stream'
        ],
        'uax' => [
            'application/octet-stream'
        ],
        'rom' => [
            'application/octet-stream'
        ],

        // Virtualization
        'ova' => [
            'application/octet-stream'
        ],
        'ovf' => [
            'application/octet-stream'
        ],
        'pvm' => [
            'application/octet-stream'
        ],
        'vdi' => [
            'application/octet-stream'
        ],
        'vhd' => [
            'application/octet-stream'
        ],
        'vmdk' => [
            'application/octet-stream'
        ],
        'vmem' => [
            'application/octet-stream'
        ],
        'vmx' => [
            'application/octet-stream'
        ],

        // Internet
        'aspx' => [
            'text/plain'
        ],
        'atom' => [
            'application/atom+xml'
        ],
        'bc' => [
            'application/octet-stream'
        ],
        'class' => [
            'application/java-vm'
        ],
        'crdownload' => [
            'application/octet-stream'
        ],
        'css' => [
            'text/css'
        ],
        'download' => [
            'application/octet-stream'
        ],
        'gdoc' => [
            'application/octet-stream'
        ],
        'gsheet' => [
            'application/octet-stream'
        ],
        'gslides' => [
            'application/octet-stream'
        ],
        'js' => [
            'text/javascript',
            'application/javascript',
            'application/octet-stream'
        ],
        'json' => [
            'application/json',
            'text/json'
        ],
        'jsp' => [
            'application/jsp'
        ],
        'part' => [
            'application/octet-stream'
        ],
        'rss' => [
            'application/rss+xml'
        ],
        'torrent' => [
            'application/x-bittorrent'
        ],

        // E-mail
        'dbx' => [
            'application/octet-stream'
        ],
        'eml' => [
            'message/rfc822'
        ],
        'msg' => [
            'application/x-msg'
        ],
        'vcf' => [
            'text/plain',
            'text/x-vcard',
            'application/octet-stream'
        ],

        // Executables
        'exe' => [
            'application/x-ms-dos-executable'
        ],
        'bat' => [
            'application/x-msdos-program'
        ],
        'com' => [
            'application/x-com'
        ],
        'gadget' => [
            'application/octet-stream'
        ],
        'lnk' => [
            'application/octet-stream'
        ],
        'msi' => [
            'application/x-msi'
        ],
        'prg' => [
            'application/octet-stream'
        ],
        'scr' => [
            'image/x-scr',
            'application/octet-stream'
        ],
        'vbs' => [
            'application/x-vbs'
        ],
        'bin' => [
            'application/octet-stream'
        ],
        'dll' => [
            'application/x-msdownload'
        ],
        'drv' => [
            'application/octet-stream'
        ],
        'jar' => [
            'application/java-archive'
        ],
        'ocx' => [
            'application/octet-stream'
        ],
        'sys' => [
            'text/plain',
            'application/octet-stream'
        ],
        'deb' => [
            'application/x-debian-package'
        ],
        'rpm' => [
            'application/x-rpm',
            'application/octet-stream'
        ],
        'dmg' => [
            'application/octet-stream'
        ],

        // Archives
        '7z' => [
            'application/x-7z-compressed'
        ],
        '7zip' => [
            'application/x-7z-compressed'
        ],
        'gz' => [
            'application/x-gzip'
        ],
        'gzip' => [
            'application/x-gzip'
        ],
        'pkg' => [
            'application/octet-stream'
        ],
        'rar' => [
            'application/x-rar-compressed'
        ],
        'tar' => [
            'application/x-tar'
        ],
        'tgz' => [
            'application/x-gzip'
        ],
        'zip' => [
            'application/x-zip-compressed'
        ],

        // Backup
        'bak' => [
            'application/octet-stream'
        ],
        'bkp' => [
            'application/octet-stream'
        ],
        'iso' => [
            'application/octet-stream'
        ],
        'old' => [
            'application/octet-stream'
        ],

        // Disk images
        'img' => [
            'application/octet-stream'
        ],
        'vcd' => [
            'application/octet-stream'
        ],
        'tc' => [
            'application/octet-stream'
        ],
        'mdf' => [
            'application/octet-stream'
        ],
        'mds' => [
            'application/octet-stream'
        ],

        // Phone formats
        'apk' => [
            'application/vnd.android.package-archive'
        ],
        'asec' => [
            'application/octet-stream'
        ],
        'crypt' => [
            'application/octet-stream'
        ],
        'ipa' => [
            'application/octet-stream'
        ],
        'ipsw' => [
            'application/octet-stream'
        ],
        'lqm' => [
            'application/octet-stream'
        ],
        'mdbackup' => [
            'application/octet-stream'
        ],
        'nomedia' => [
            'application/octet-stream'
        ],
        'pkpass' => [
            'application/octet-stream'
        ],
        'rsc' => [
            'application/octet-stream'
        ],
        'sbf' => [
            'application/octet-stream'
        ],
        'tpk' => [
            'application/octet-stream'
        ],

        // Other
        'map' => [
            'application/octet-stream'
        ],
        'kml' => [
            'application/octet-stream',
            'application/vnd.google-earth.kml+xml'
        ],
        'gpx' => [
            'application/octet-stream'
        ],
        'swp' => [
            'application/octet-stream'
        ],
        'dump' => [
            'application/octet-stream'
        ],
        'crx' => [
            'application/x-chrome-extension'
        ],
        'plugin' => [
            'application/octet-stream',
            'application/x-photoshop'
        ],
        'safariextz' => [
            'application/octet-stream'
        ],
        'xpi' => [
            'application/x-xpinstall'
        ],
        'asm' => [
            'text/plain',
            'application/octet-stream'
        ],
        'java' => [
            'text/plain'
        ],
        'rc' => [
            'text/plain'
        ],
        'lib' => [
            'application/octet-stream'
        ],
        'src' => [
            'text/plain',
            'application/octet-stream'
        ],
        'xcodeproj' => [
            'application/octet-stream'
        ],
        'cfg' => [
            'application/octet-stream'
        ],
        'config' => [
            'application/octet-stream'
        ],
        'ini' => [
            'text/plain'
        ],
        'cal' => [
            'image/x-cals',
            'application/octet-stream'
        ],
        '3dr' => [
            'application/octet-stream'
        ],
        'md5' => [
            'application/octet-stream',
            'text/plain'
        ],
        'rep' => [
            'application/octet-stream',
            'application/vnd.businessobjects'
        ],
        'ref' => [
            'application/octet-stream'
        ],

        'sql' => [
            'text/plain'
        ]

    ];

    public function __construct(array $metadata) {

        // Save file metadata
        $this->data = $metadata;

        // Check if file format is supported
        $this->checkFormat();

        // Save file
        $this->saveFile();

        // Return file information
        $this->returnInformation();

    }

    public function checkFormat() {

        // Get file extension
        $this->extension = pathinfo($this->data['name'])['extension'];

        echo $this->extension;
        echo 'extension error';

        // Check file extension
        if(!in_array($this->extension, $this->supportedExtensions))
            new UserEvents(50);  // Unsupported file format

        echo 'format error';

        // Get file MIME type
        $formatType = mime_content_type($this->data['tmp_name']);

        // Check format type
        echo $formatType;
        if(!in_array($formatType, $this->supportedFormats[$this->extension]))
            new UserEvents(50);  // Unsupported file format

    }

    public function saveFile() {

        // Create new file path and name
        $additionPre = '(';
        $additionPost = ')';
        $additionContent = 1;

        $name = pathinfo($this->data['name'], PATHINFO_FILENAME);
        $destination = 'app/Data/Files/Files/' . $name . '.' . $this->extension;

        while(file_exists($destination)) {
            $addition = $additionPre . $additionContent . $additionPost;
            $destination = 'app/Data/Files/Files/' . $name . ' ' . $addition . '.' . $this->extension;
            ++$additionContent;
        }

        // Move and save file
        $this->destination = $destination;
        move_uploaded_file($this->data['tmp_name'],ROOT . '/' . $destination);

    }

    public function returnInformation() {

        // Create result array
        $result = [
            'success' => true,
            'code' => 200,
            'path' => $this->destination,
            'size' => filesize(ROOT . '/' . $this->destination)
        ];

        echo json_encode($result);
        return true;

    }

}