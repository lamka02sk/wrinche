<?php

/*
 * wrinche. Modern, powerful and user friendly CMS.
 * Sends mails
 * Version: 0.1.0
 * Authors: lamka02sk
 */

namespace App\Helpers;

class Mail {

    /**
     * @var Sanitizer
     * @var Validator
     * Helper instances
     */
    private $sanitizer;
    private $validator;

    /**
     * @var array
     * Array of all recipients
     */
    public $recipients = [];

    /**
     * @var bool
     * Email priority: true = high priority
     */
    public $priority = false;

    /**
     * @var string
     * Sender
     */
    public $from = '';

    /**
     * @var string
     * Carbon Copy
     */
    public $cc = '';

    /**
     * @var string
     * Headers
     */
    public $headers = '';

    /**
     * Mail constructor.
     */
    public function __construct() {

        // TODO: Some settings
        $this->sanitizer = new Sanitizer;
        $this->validator = new Validator;

    }

    /**
     * @param bool $priority
     * Set email priority
     * @return bool
     */
    public function setPriority(bool $priority = true) {

        if($priority)
            $this->priority = true;
        else
            $this->priority = false;

        return true;

    }

    /**
     * @param string $from
     * Add sender email
     * @return bool
     */
    public function addFrom(string $from) {

        if(!empty($this->from))
            return false;

        if(!$this->validator->validateEmail($from))
            return false;

        $from = $this->sanitizer->sanitizeEmail($from);
        $this->from = "From: " . $from . "\n";

        return true;

    }

    /**
     * @param string $copyRecipient
     * Add carbon copy
     * @return bool
     */
    public function addCC(string $copyRecipient) {

        if(!empty($this->cc))
            return false;

        if(!$this->validator->validateEmail($copyRecipient))
            return false;

        $copyRecipient = $this->sanitizer->sanitizeEmail($copyRecipient);
        $this->cc = "Cc: " . $copyRecipient . "\n";

        return true;

    }

    /**
     * @param string $recipient
     * Add single recipient
     * @return bool
     */
    public function addRecipient(string $recipient) {

        if(!$this->validator->validateEmail($recipient))
            return false;

        $recipient = $this->sanitizer->sanitizeEmail($recipient);
        $this->recipients[] = $recipient;

        return true;

    }

    /**
     * @param array $recipients
     * Add array of recipients
     */
    public function addRecipients(array $recipients) {

        foreach($recipients as $recipient)
            $this->addRecipient($recipient);

    }

    /**
     * @return bool
     * Create complete email headers
     */
    public function createHeaders() {

        if(empty($this->from))
            return false;

        $headers = $this->from;
        if(!empty($this->cc))
            $headers .= $this->cc;

        $headers .= "X-Sender: " . $this->from . "\n";
        $headers .= 'X-Mailer: PHP/' . phpversion();

        if($this->priority)
            $headers .= "X-Priority: 1\n";

        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=UTF-8\n";

        $this->headers = $headers;
        return true;


    }

    /**
     * @return bool
     * Prepare recipients list
     */
    public function prepareRecipients() {

        $this->recipients = implode(', ', $this->recipients);
        return true;

    }

    /**
     * @return bool
     * Prepare email headers
     */
    public function prepareEmail() {

        if(!$this->createHeaders())
            return false;

        $this->prepareRecipients();
        return true;

    }

    /**
     * @param string $subject
     * @param string $message
     * Add subject and message and send email
     * @return bool
     */
    public function sendEmail(string $subject, string $message) {

        if(!$this->prepareEmail())
            return false;

        mail($this->recipients, $subject, $message, $this->headers);
        return true;

    }

}