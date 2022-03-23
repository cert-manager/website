---
title: API reference docs
description: cert-manager API reference documentation
---

<p>Packages:</p>
<ul>
  <li>
    <a href="#acme.cert-manager.io%2fv1">acme.cert-manager.io/v1</a>
  </li>
  <li>
    <a href="#acme.cert-manager.io%2fv1alpha2">acme.cert-manager.io/v1alpha2</a>
  </li>
  <li>
    <a href="#acme.cert-manager.io%2fv1alpha3">acme.cert-manager.io/v1alpha3</a>
  </li>
  <li>
    <a href="#acme.cert-manager.io%2fv1beta1">acme.cert-manager.io/v1beta1</a>
  </li>
  <li>
    <a href="#cert-manager.io%2fv1">cert-manager.io/v1</a>
  </li>
  <li>
    <a href="#cert-manager.io%2fv1alpha2">cert-manager.io/v1alpha2</a>
  </li>
  <li>
    <a href="#cert-manager.io%2fv1alpha3">cert-manager.io/v1alpha3</a>
  </li>
  <li>
    <a href="#cert-manager.io%2fv1beta1">cert-manager.io/v1beta1</a>
  </li>
  <li>
    <a href="#meta.cert-manager.io%2fv1">meta.cert-manager.io/v1</a>
  </li>
</ul>
<h2 id="acme.cert-manager.io/v1">acme.cert-manager.io/v1</h2>
<div>
  <p>Package v1 is the v1 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#acme.cert-manager.io/v1.Challenge">Challenge</a>
  </li>
  <li>
    <a href="#acme.cert-manager.io/v1.Order">Order</a>
  </li>
</ul>
<h3 id="acme.cert-manager.io/v1.Challenge">Challenge</h3>
<div>
  <p>Challenge is a type to represent a Challenge request with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Challenge</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ChallengeSpec">ChallengeSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>url</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>The URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>authorizationURL</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>The URL to the ACME Authorization resource that this challenge is a part of.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p> dnsName is the identifier that this challenge is for, e.g. example.com. If the requested DNSName is a &lsquo;wildcard&rsquo;, this field MUST be set to the non-wildcard domain, e.g. for <code>*.example.com</code>, it must be <code>example.com</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>wildcard</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>type</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1.ACMEChallengeType">ACMEChallengeType</a>
              </em>
            </td>
            <td>
              <p>The type of ACME challenge this resource represents. One of &ldquo;HTTP-01&rdquo; or &ldquo;DNS-01&rdquo;.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>token</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>The ACME challenge token for this challenge. This is the raw value returned from the ACME server.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>key</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>
                The ACME challenge key for this challenge For HTTP01 challenges, this is the value that must be responded with to complete the HTTP01 challenge in the format:
                <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>. For DNS01 challenges, this is the base64 encoded SHA256 sum of the
                <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>
                text that must be set as the TXT record content.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>solver</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1.ACMEChallengeSolver">ACMEChallengeSolver</a>
              </em>
            </td>
            <td>
              <p>Contains the domain solving configuration that should be used to solve this challenge resource.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>References a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ChallengeStatus">ChallengeStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.Order">Order</h3>
<div>
  <p>Order is a type to represent an Order with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Order</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.OrderSpec">OrderSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>request</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> CommonName is the common name as specified on the DER encoded CSR. If specified, this value must also be present in <code>dnsNames</code> or <code>ipAddresses</code>. This field must match the corresponding field on the DER encoded CSR. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>ipAddresses</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IPAddresses is a list of IP addresses that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Duration is the duration for the not after date for the requested certificate. this is set on order creation as pe the ACME spec.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.OrderStatus">OrderStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEAuthorization">ACMEAuthorization</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>ACMEAuthorization contains data returned from the ACME server on an authorization that must be completed in order validate a DNS name on an ACME Order resource.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of the Authorization that must be completed</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>identifier</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Identifier is the DNS name to be validated as part of this authorization</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Wildcard will be true if this authorization is for a wildcard DNS name. If this is true, the identifier will be the <em>non-wildcard</em> version of the DNS name. For example, if &lsquo;*.example.com&rsquo; is the DNS name being validated, this field will be &lsquo;true&rsquo; and the &lsquo;identifier&rsquo; field will be &lsquo;example.com&rsquo;. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>initialState</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>InitialState is the initial state of the ACME authorization when first fetched from the ACME server. If an Authorization is already &lsquo;valid&rsquo;, the Order controller will not create a Challenge resource for the authorization. This will occur when working with an ACME server that enables &lsquo;authz reuse&rsquo; (such as Let&rsquo;s Encrypt&rsquo;s production endpoint). If not set and &lsquo;identifier&rsquo; is set, the state is assumed to be pending and a Challenge will be created.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>challenges</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallenge">[]ACMEChallenge</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Challenges specifies the challenge types offered by the ACME server. One of these challenge types will be selected when validating the DNS name and an appropriate Challenge resource will be created to perform the ACME challenge process.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEChallenge">ACMEChallenge</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEAuthorization">ACMEAuthorization</a>) </p>
<div>
  <p>Challenge specifies a challenge offered by the ACME server for an Order. An appropriate Challenge resource can be created to perform the ACME challenge process.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of this challenge. It can be used to retrieve additional metadata about the Challenge from the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Token is the token that must be presented for this challenge. This is used to compute the &lsquo;key&rsquo; that must also be presented.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Type is the type of challenge being offered, e.g. &lsquo;http-01&rsquo;, &lsquo;dns-01&rsquo;, &lsquo;tls-sni-01&rsquo;, etc. This is the raw value retrieved from the ACME server. Only &lsquo;http-01&rsquo; and &lsquo;dns-01&rsquo; are supported by cert-manager, other values will be ignored.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEChallengeSolver">ACMEChallengeSolver</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1.ChallengeSpec">ChallengeSpec</a>) </p>
<div>
  <p>Configures an issuer to solve challenges using the specified options. Only one of HTTP01 or DNS01 may be provided.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>selector</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.CertificateDNSNameSelector">CertificateDNSNameSelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Selector selects a set of DNSNames on the Certificate resource that should be solved using this challenge solver. If not specified, the solver will be treated as the &lsquo;default&rsquo; solver with the lowest priority, i.e. if any other solver has a more specific match, it will be used instead.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>http01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Configures cert-manager to attempt to complete authorizations by performing the HTTP01 challenge flow. It is not possible to obtain certificates for wildcard domain names (e.g. <code>*.example.com</code>) using the HTTP01 challenge mechanism. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dns01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Configures cert-manager to attempt to complete authorizations by performing the DNS01 challenge flow.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>Used to configure a DNS01 challenge provider to be used when solving DNS01 challenges. Only one DNS provider may be configured per solver.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>cnameStrategy</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.CNAMEStrategy">CNAMEStrategy</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>akamai</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Akamai DNS zone management API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloudDNS</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Google Cloud DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloudflare</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Cloudflare API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>route53</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the AWS Route53 API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>azureDNS</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Microsoft Azure DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>digitalocean</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the DigitalOcean DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>acmeDNS</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Use the &lsquo;ACME DNS&rsquo; (<a href="https://github.com/joohoi/acme-dns">https://github.com/joohoi/acme-dns</a>) API to manage DNS01 challenge records. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>rfc2136</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Use RFC2136 (&ldquo;Dynamic Updates in the Domain Name System&rdquo;) (<a href="https://datatracker.ietf.org/doc/rfc2136/">https://datatracker.ietf.org/doc/rfc2136/</a>) to manage DNS01 challenge records. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>webhook</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Configure an external webhook based DNS01 challenge solver to manage DNS01 challenge records.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>ACMEChallengeSolverHTTP01 contains configuration detailing how to solve HTTP01 challenges within a Kubernetes cluster. Typically this is accomplished through creating &lsquo;routes&rsquo; of some description that configure ingress controllers to direct traffic to &lsquo;solver pods&rsquo;, which are responsible for responding to the ACME server&rsquo;s HTTP requests.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>ingress</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress based HTTP01 challenge solver will solve challenges by creating or modifying Ingress resources in order to route requests for &lsquo;/.well-known/acme-challenge/XYZ&rsquo; to &lsquo;challenge solver&rsquo; pods that are provisioned by cert-manager for each Challenge to be completed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceType</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#servicetype-v1-core">Kubernetes core/v1.ServiceType</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional service type for Kubernetes solver service</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>class</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress class to use when creating Ingress resources to solve ACME challenges that use this challenge solver. Only one of &lsquo;class&rsquo; or &lsquo;name&rsquo; may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>name</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The name of the ingress resource that should have ACME challenge solving routes inserted into it in order to solve HTTP01 challenges. This is typically used in conjunction with ingress controllers like ingress-gce, which maintains a 1:1 mapping between external IPs and ingress resources.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>podTemplate</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional pod template used to configure the ACME challenge solver pods used for HTTP01 challenges</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ingressTemplate</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional ingress template used to configure the ACME challenge solver ingress used for HTTP01 challenges</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressObjectMeta">ACMEChallengeSolverHTTP01IngressObjectMeta</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>annotations</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Annotations that should be added to the created ACME HTTP01 solver ingress.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>labels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Labels that should be added to the created ACME HTTP01 solver ingress.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>annotations</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Annotations that should be added to the create ACME HTTP01 solver pods.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>labels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Labels that should be added to the created ACME HTTP01 solver pods.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nodeSelector</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>affinity</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s scheduling constraints</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tolerations</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s tolerations.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>priorityClassName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s priorityClassName.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>serviceAccountName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s service account</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ObjectMeta overrides for the pod used to solve HTTP01 challenges. Only the &lsquo;labels&rsquo; and &lsquo;annotations&rsquo; fields may be set. If labels or annotations overlap with in-built values, the values here will override the in-built values.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PodSpec defines overrides for the HTTP01 challenge solver pod. Only the &lsquo;priorityClassName&rsquo;, &lsquo;nodeSelector&rsquo;, &lsquo;affinity&rsquo;, &lsquo;serviceAccountName&rsquo; and &lsquo;tolerations&rsquo; fields are supported currently. All other fields will be ignored.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>nodeSelector</code>
              <br />
              <em>map[string]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>affinity</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s scheduling constraints</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>tolerations</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s tolerations.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>priorityClassName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s priorityClassName.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>serviceAccountName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s service account</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverHTTP01IngressObjectMeta">ACMEChallengeSolverHTTP01IngressObjectMeta</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ObjectMeta overrides for the ingress used to solve HTTP01 challenges. Only the &lsquo;labels&rsquo; and &lsquo;annotations&rsquo; fields may be set. If labels or annotations overlap with in-built values, the values here will override the in-built values.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEChallengeType"> ACMEChallengeType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ChallengeSpec">ChallengeSpec</a>) </p>
<div>
  <p>The type of ACME challenge. Only HTTP-01 and DNS-01 are supported.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;DNS-01&#34;</p>
      </td>
      <td>
        <p> ACMEChallengeTypeDNS01 denotes a Challenge is of type dns-01 More info: <a href="https://letsencrypt.org/docs/challenge-types/#dns-01-challenge">https://letsencrypt.org/docs/challenge-types/#dns-01-challenge</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;HTTP-01&#34;</p>
      </td>
      <td>
        <p> ACMEChallengeTypeHTTP01 denotes a Challenge is of type http-01 More info: <a href="https://letsencrypt.org/docs/challenge-types/#http-01-challenge">https://letsencrypt.org/docs/challenge-types/#http-01-challenge</a> </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEExternalAccountBinding">ACMEExternalAccountBinding</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEIssuer">ACMEIssuer</a>) </p>
<div>
  <p>ACMEExternalAccountBinding is a reference to a CA external account of the ACME server.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>keyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>keyID is the ID of the CA key that the External Account is bound to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> keySecretRef is a Secret Key Selector referencing a data item in a Kubernetes Secret which holds the symmetric MAC key of the External Account Binding. The <code>key</code> is the index string that is paired with the key data in the Secret and should not be confused with the key data itself, or indeed with the External Account Binding keyID above. The secret key stored in the Secret <strong>must</strong> be un-padded, base64 URL encoded data. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyAlgorithm</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.HMACKeyAlgorithm">HMACKeyAlgorithm</a>
        </em>
      </td>
      <td>
        <p>keyAlgorithm is the MAC key algorithm that the key is used for. Valid values are &ldquo;HS256&rdquo;, &ldquo;HS384&rdquo; and &ldquo;HS512&rdquo;.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEIssuer">ACMEIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>ACMEIssuer contains the specification for an ACME issuer. This uses the RFC8555 specification to obtain certificates by completing &lsquo;challenges&rsquo; to prove ownership of domain identifiers. Earlier draft versions of the ACME specification are not supported.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Email is the email address to be associated with the ACME account. This field is optional, but it is strongly recommended to be set. It will be used to contact you in case of issues with your account or certificates, including expiry notification emails. This field may be updated after the account is initially registered.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Server is the URL used to access the ACME server&rsquo;s &lsquo;directory&rsquo; endpoint. For example, for Let&rsquo;s Encrypt&rsquo;s staging endpoint, you would use: &ldquo;<a href='https://acme-staging-v02.api.letsencrypt.org/directory"'>https://acme-staging-v02.api.letsencrypt.org/directory&rdquo;</a>. Only ACME v2 endpoints (i.e. RFC 8555) are supported. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>preferredChain</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PreferredChain is the chain to use if the ACME server outputs multiple. PreferredChain is no guarantee that this one gets delivered by the ACME endpoint. For example, for Let&rsquo;s Encrypt&rsquo;s DST crosssign you would use: &ldquo;DST Root CA X3&rdquo; or &ldquo;ISRG Root X1&rdquo; for the newer Let&rsquo;s Encrypt root CA. This value picks the first certificate bundle in the ACME alternative chains that has a certificate with this value as its issuer&rsquo;s CN</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>skipTLSVerify</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Enables or disables validation of the ACME server TLS certificate. If true, requests to the ACME server will not have their TLS certificate validated (i.e. insecure connections will be allowed). Only enable this option in development environments. The cert-manager system installed roots will be used to verify connections to the ACME server if this is false. Defaults to false.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>externalAccountBinding</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ExternalAccountBinding is a reference to a CA external account of the ACME server. If set, upon registration cert-manager will attempt to associate the given external account credentials with the registered ACME account.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>privateKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> PrivateKey is the name of a Kubernetes Secret resource that will be used to store the automatically generated ACME account private key. Optionally, a <code>key</code> may be specified to select a specific entry within the named Secret resource. If <code>key</code> is not specified, a default of <code>tls.key</code> will be used. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solvers</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallengeSolver">[]ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Solvers is a list of challenge solvers that will be used to solve ACME challenges for the matching domains. Solver configurations must be provided in order to obtain certificates from an ACME server. For more information, see: <a href="https://cert-manager.io/docs/configuration/acme/">https://cert-manager.io/docs/configuration/acme/</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>disableAccountKeyGeneration</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Enables or disables generating a new ACME account key. If true, the Issuer resource will <em>not</em> request a new account but will expect the account key to be supplied via an existing secret. If false, the cert-manager system will generate a new ACME account key for the Issuer. Defaults to false. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>enableDurationFeature</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Enables requesting a Not After date on certificates that matches the duration of the certificate. This is not supported by all ACME servers like Let&rsquo;s Encrypt. If set to true when the ACME server does not support it it will create an error on the Order. Defaults to false.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAcmeDNS is a structure containing the configuration for ACME-DNS servers</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>host</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAkamai is a structure containing the DNS configuration for Akamai DNS—Zone Record Management API</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceConsumerDomain</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accessTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAzureDNS is a structure containing the configuration for Azure DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>clientID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>if both this and ClientSecret are left unset MSI will be used</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>if both this and ClientID are left unset MSI will be used</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>subscriptionID</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>tenantID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>when specifying ClientID and ClientSecret then this field is also needed</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>resourceGroupName</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>environment</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.AzureDNSEnvironment">AzureDNSEnvironment</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderCloudDNS is a structure containing the DNS configuration for Google Cloud DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceAccountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>project</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>HostedZoneName is an optional field that tells cert-manager in which Cloud DNS zone the challenge record has to be created. If left empty cert-manager will automatically choose a zone.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p> ACMEIssuerDNS01ProviderCloudflare is a structure containing the DNS configuration for Cloudflare. One of <code>apiKeySecretRef</code> or <code>apiTokenSecretRef</code> must be provided. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Email of the account, only required when using API key based authentication.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>API key to use to authenticate with Cloudflare. Note: using an API token to authenticate is now the recommended method as it allows greater control of permissions.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>API token used to authenticate with Cloudflare.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderDigitalOcean is a structure containing the DNS configuration for DigitalOcean Domains</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRFC2136 is a structure containing the configuration for RFC2136 DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nameserver</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The IP address or hostname of an authoritative DNS server supporting RFC2136 in the form host:port. If the host is an IPv6 address it must be enclosed in square brackets (e.g [2001:db8::1]) ; port is optional. This field is required.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The name of the secret containing the TSIG value. If <code>tsigKeyName</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigKeyName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Key name configured in the DNS. If <code>tsigSecretSecretRef</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigAlgorithm</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Algorithm configured in the DNS supporting RFC2136. Used only when <code>tsigSecretSecretRef</code> and <code>tsigKeyName</code> are defined. Supported values are (case-insensitive): <code>HMACMD5</code> (default), <code>HMACSHA1</code>, <code>HMACSHA256</code> or <code>HMACSHA512</code>. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRoute53 is a structure containing the Route 53 configuration for AWS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>accessKeyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The AccessKeyID is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata see: <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretAccessKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The SecretAccessKey is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata
          <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a>
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Role is a Role ARN which the Route53 provider will assume using either the explicit credentials AccessKeyID/SecretAccessKey or the inferred credentials from environment variables, shared credentials file or AWS Instance metadata</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If set, the provider will manage only this zone in Route53 and will not do an lookup using the route53:ListHostedZonesByName api call.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>region</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Always set the region when using AccessKeyID and SecretAccessKey</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderWebhook specifies configuration for a webhook DNS01 provider, including where to POST ChallengePayload resources.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>groupName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The API group name that should be used when POSTing ChallengePayload resources to the webhook apiserver. This should be the same as the GroupName specified in the webhook provider implementation.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solverName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The name of the solver to use, as defined in the webhook provider implementation. This will typically be the name of the provider, e.g. &lsquo;cloudflare&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>config</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#json-v1beta1-apiextensions">Kubernetes apiextensions/v1beta1.JSON</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Additional configuration that should be passed to the webhook apiserver when challenges are processed. This can contain arbitrary JSON data. Secret values should not be specified in this stanza. If secret values are needed (e.g. credentials for a DNS service), you should use a SecretKeySelector to reference a Secret resource. For details on the schema of this field, consult the webhook provider implementation&rsquo;s documentation.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ACMEIssuerStatus">ACMEIssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.IssuerStatus">IssuerStatus</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>uri</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URI is the unique account identifier, which can also be used to retrieve account details from the CA</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastRegisteredEmail</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastRegisteredEmail is the email associated with the latest registered ACME account, in order to track changes made to registered account associated with the Issuer</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.AzureDNSEnvironment"> AzureDNSEnvironment (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;AzureChinaCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureGermanCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzurePublicCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureUSGovernmentCloud&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.CNAMEStrategy"> CNAMEStrategy (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones. By default, the None strategy will be applied (i.e. do not follow CNAMEs).</p>
</div>
<h3 id="acme.cert-manager.io/v1.CertificateDNSNameSelector">CertificateDNSNameSelector</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>CertificateDomainSelector selects certificates using a label selector, and can optionally select individual DNS names within those certificates. If both MatchLabels and DNSNames are empty, this selector will match all certificates and DNS names within them.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>matchLabels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>A label selector that is used to refine the set of certificate&rsquo;s that this challenge solver will apply to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSNames that this solver will be used to solve. If specified and a match is found, a dnsNames selector will take precedence over a dnsZones selector. If multiple solvers match with the same dnsNames value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsZones</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSZones that this solver will be used to solve. The most specific DNS zone match specified here will take precedence over other DNS zone matches, so a solver specifying sys.example.com will be selected over one specifying example.com for the domain www.sys.example.com. If multiple solvers match with the same dnsZones value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ChallengeSpec">ChallengeSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>authorizationURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The URL to the ACME Authorization resource that this challenge is a part of.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> dnsName is the identifier that this challenge is for, e.g. example.com. If the requested DNSName is a &lsquo;wildcard&rsquo;, this field MUST be set to the non-wildcard domain, e.g. for <code>*.example.com</code>, it must be <code>example.com</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallengeType">ACMEChallengeType</a>
        </em>
      </td>
      <td>
        <p>The type of ACME challenge this resource represents. One of &ldquo;HTTP-01&rdquo; or &ldquo;DNS-01&rdquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The ACME challenge token for this challenge. This is the raw value returned from the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>key</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>
          The ACME challenge key for this challenge For HTTP01 challenges, this is the value that must be responded with to complete the HTTP01 challenge in the format:
          <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>. For DNS01 challenges, this is the base64 encoded SHA256 sum of the
          <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>
          text that must be set as the TXT record content.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solver</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEChallengeSolver">ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <p>Contains the domain solving configuration that should be used to solve this challenge resource.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>References a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.ChallengeStatus">ChallengeStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>processing</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Used to denote whether this challenge should be processed or not. This field will only be set to true by the &lsquo;scheduling&rsquo; component. It will only be set to false by the &lsquo;challenges&rsquo; controller, after the challenge has reached a final state or timed out. If this field is set to false, the challenge controller will not take any more action.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>presented</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> presented will be set to true if the challenge values for this challenge are currently &lsquo;presented&rsquo;. This <em>does not</em> imply the self check is passing. Only that the values have been &lsquo;submitted&rsquo; for the appropriate challenge mechanism (i.e. the DNS01 TXT record has been presented, or the HTTP01 configuration has been configured). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Contains human readable information on why the Challenge is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Contains the current &lsquo;state&rsquo; of the challenge. If not set, the state of the challenge is unknown.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.HMACKeyAlgorithm"> HMACKeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>) </p>
<div>
  <p>HMACKeyAlgorithm is the name of a key algorithm used for HMAC encryption</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;HS256&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS384&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS512&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.OrderSpec">OrderSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>request</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> CommonName is the common name as specified on the DER encoded CSR. If specified, this value must also be present in <code>dnsNames</code> or <code>ipAddresses</code>. This field must match the corresponding field on the DER encoded CSR. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ipAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IPAddresses is a list of IP addresses that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Duration is the duration for the not after date for the requested certificate. this is set on order creation as pe the ACME spec.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.OrderStatus">OrderStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URL of the Order. This will initially be empty when the resource is first created. The Order controller will populate this field when the Order is first processed. This field will be immutable after it is initially set.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>finalizeURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FinalizeURL of the Order. This is used to obtain certificates for this order once it has been completed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>authorizations</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEAuthorization">[]ACMEAuthorization</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Authorizations contains data returned from the ACME server on what authorizations must be completed in order to validate the DNS names specified on the Order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Certificate is a copy of the PEM encoded certificate for this Order. This field will be populated after the order has been successfully finalized with the ACME server, and the order has transitioned to the &lsquo;valid&rsquo; state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State contains the current state of this Order resource. States &lsquo;success&rsquo; and &lsquo;expired&rsquo; are &lsquo;final&rsquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason optionally provides more information about a why the order is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this order failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1.State"> State (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEAuthorization">ACMEAuthorization</a>, <a href="#acme.cert-manager.io/v1.ChallengeStatus">ChallengeStatus</a>, <a href="#acme.cert-manager.io/v1.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>
    State represents the state of an ACME resource, such as an Order. The possible options here map to the corresponding values in the ACME specification. Full details of these values can be found here: <a href="https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6">https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6</a>
    Clients utilising this type must also gracefully handle unknown values, as the contents of this enumeration may be added to over time.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;errored&#34;</p>
      </td>
      <td>
        <p>Errored signifies that the ACME resource has errored for some reason. This is a catch-all state, and is used for marking internal cert-manager errors such as validation failures. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;expired&#34;</p>
      </td>
      <td>
        <p>Expired signifies that an ACME resource has expired. If an Order is marked &lsquo;Expired&rsquo;, one of its validations may have expired or the Order itself. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;invalid&#34;</p>
      </td>
      <td>
        <p>Invalid signifies that an ACME resource is invalid for some reason. If an Order is marked &lsquo;invalid&rsquo;, one of its validations be have invalid for some reason. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;pending&#34;</p>
      </td>
      <td>
        <p>Pending signifies that an ACME resource is still pending and is not yet ready. If an Order is marked &lsquo;Pending&rsquo;, the validations for that Order are still in progress. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;processing&#34;</p>
      </td>
      <td>
        <p>Processing signifies that an ACME resource is being processed by the server. If an Order is marked &lsquo;Processing&rsquo;, the validations for that Order are currently being processed. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;ready&#34;</p>
      </td>
      <td>
        <p>Ready signifies that an ACME resource is in a ready state. If an order is &lsquo;ready&rsquo;, all of its challenges have been completed successfully and the order is ready to be finalized. Once finalized, it will transition to the Valid state. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;&#34;</p>
      </td>
      <td>
        <p>Unknown is not a real state as part of the ACME spec. It is used to represent an unrecognised value.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;valid&#34;</p>
      </td>
      <td>
        <p>Valid signifies that an ACME resource is in a valid state. If an order is &lsquo;valid&rsquo;, it has been finalized with the ACME server and the certificate can be retrieved from the ACME server using the certificate URL stored in the Order&rsquo;s status subresource. This is a final state.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="acme.cert-manager.io/v1alpha2">acme.cert-manager.io/v1alpha2</h2>
<div>
  <p>Package v1alpha2 is the v1alpha2 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#acme.cert-manager.io/v1alpha2.Challenge">Challenge</a>
  </li>
  <li>
    <a href="#acme.cert-manager.io/v1alpha2.Order">Order</a>
  </li>
</ul>
<h3 id="acme.cert-manager.io/v1alpha2.Challenge">Challenge</h3>
<div>
  <p>Challenge is a type to represent a Challenge request with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Challenge</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ChallengeSpec">ChallengeSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>url</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>URL is the URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>authzURL</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>AuthzURL is the URL to the ACME Authorization resource that this challenge is a part of.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p> DNSName is the identifier that this challenge is for, e.g. example.com. If the requested DNSName is a &lsquo;wildcard&rsquo;, this field MUST be set to the non-wildcard domain, e.g. for <code>*.example.com</code>, it must be <code>example.com</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>wildcard</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>type</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeType">ACMEChallengeType</a>
              </em>
            </td>
            <td>
              <p>Type is the type of ACME challenge this resource represents. One of &ldquo;http-01&rdquo; or &ldquo;dns-01&rdquo;.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>token</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>Token is the ACME challenge token for this challenge. This is the raw value returned from the ACME server.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>key</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>
                Key is the ACME challenge key for this challenge For HTTP01 challenges, this is the value that must be responded with to complete the HTTP01 challenge in the format:
                <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>. For DNS01 challenges, this is the base64 encoded SHA256 sum of the
                <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>
                text that must be set as the TXT record content.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>solver</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</a>
              </em>
            </td>
            <td>
              <p>Solver contains the domain solving configuration that should be used to solve this challenge resource.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ChallengeStatus">ChallengeStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.Order">Order</h3>
<div>
  <p>Order is a type to represent an Order with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Order</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.OrderSpec">OrderSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>csr</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> CommonName is the common name as specified on the DER encoded CSR. If specified, this value must also be present in <code>dnsNames</code> or <code>ipAddresses</code>. This field must match the corresponding field on the DER encoded CSR. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>ipAddresses</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IPAddresses is a list of IP addresses that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Duration is the duration for the not after date for the requested certificate. this is set on order creation as pe the ACME spec.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.OrderStatus">OrderStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEAuthorization">ACMEAuthorization</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>ACMEAuthorization contains data returned from the ACME server on an authorization that must be completed in order validate a DNS name on an ACME Order resource.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of the Authorization that must be completed</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>identifier</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Identifier is the DNS name to be validated as part of this authorization</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Wildcard will be true if this authorization is for a wildcard DNS name. If this is true, the identifier will be the <em>non-wildcard</em> version of the DNS name. For example, if &lsquo;*.example.com&rsquo; is the DNS name being validated, this field will be &lsquo;true&rsquo; and the &lsquo;identifier&rsquo; field will be &lsquo;example.com&rsquo;. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>initialState</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>InitialState is the initial state of the ACME authorization when first fetched from the ACME server. If an Authorization is already &lsquo;valid&rsquo;, the Order controller will not create a Challenge resource for the authorization. This will occur when working with an ACME server that enables &lsquo;authz reuse&rsquo; (such as Let&rsquo;s Encrypt&rsquo;s production endpoint). If not set and &lsquo;identifier&rsquo; is set, the state is assumed to be pending and a Challenge will be created.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>challenges</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallenge">[]ACMEChallenge</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Challenges specifies the challenge types offered by the ACME server. One of these challenge types will be selected when validating the DNS name and an appropriate Challenge resource will be created to perform the ACME challenge process.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallenge">ACMEChallenge</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEAuthorization">ACMEAuthorization</a>) </p>
<div>
  <p>Challenge specifies a challenge offered by the ACME server for an Order. An appropriate Challenge resource can be created to perform the ACME challenge process.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of this challenge. It can be used to retrieve additional metadata about the Challenge from the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Token is the token that must be presented for this challenge. This is used to compute the &lsquo;key&rsquo; that must also be presented.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Type is the type of challenge being offered, e.g. &lsquo;http-01&rsquo;, &lsquo;dns-01&rsquo;, &lsquo;tls-sni-01&rsquo;, etc. This is the raw value retrieved from the ACME server. Only &lsquo;http-01&rsquo; and &lsquo;dns-01&rsquo; are supported by cert-manager, other values will be ignored.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1alpha2.ChallengeSpec">ChallengeSpec</a>) </p>
<div>
  <p>Configures an issuer to solve challenges using the specified options. Only one of HTTP01 or DNS01 may be provided.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>selector</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.CertificateDNSNameSelector">CertificateDNSNameSelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Selector selects a set of DNSNames on the Certificate resource that should be solved using this challenge solver. If not specified, the solver will be treated as the &lsquo;default&rsquo; solver with the lowest priority, i.e. if any other solver has a more specific match, it will be used instead.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>http01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Configures cert-manager to attempt to complete authorizations by performing the HTTP01 challenge flow. It is not possible to obtain certificates for wildcard domain names (e.g. <code>*.example.com</code>) using the HTTP01 challenge mechanism. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dns01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Configures cert-manager to attempt to complete authorizations by performing the DNS01 challenge flow.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>Used to configure a DNS01 challenge provider to be used when solving DNS01 challenges. Only one DNS provider may be configured per solver.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>cnameStrategy</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.CNAMEStrategy">CNAMEStrategy</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>akamai</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Akamai DNS zone management API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>clouddns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Google Cloud DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloudflare</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Cloudflare API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>route53</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the AWS Route53 API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>azuredns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Microsoft Azure DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>digitalocean</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the DigitalOcean DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>acmedns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Use the &lsquo;ACME DNS&rsquo; (<a href="https://github.com/joohoi/acme-dns">https://github.com/joohoi/acme-dns</a>) API to manage DNS01 challenge records. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>rfc2136</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Use RFC2136 (&ldquo;Dynamic Updates in the Domain Name System&rdquo;) (<a href="https://datatracker.ietf.org/doc/rfc2136/">https://datatracker.ietf.org/doc/rfc2136/</a>) to manage DNS01 challenge records. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>webhook</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Configure an external webhook based DNS01 challenge solver to manage DNS01 challenge records.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>ACMEChallengeSolverHTTP01 contains configuration detailing how to solve HTTP01 challenges within a Kubernetes cluster. Typically this is accomplished through creating &lsquo;routes&rsquo; of some description that configure ingress controllers to direct traffic to &lsquo;solver pods&rsquo;, which are responsible for responding to the ACME server&rsquo;s HTTP requests.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>ingress</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress based HTTP01 challenge solver will solve challenges by creating or modifying Ingress resources in order to route requests for &lsquo;/.well-known/acme-challenge/XYZ&rsquo; to &lsquo;challenge solver&rsquo; pods that are provisioned by cert-manager for each Challenge to be completed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceType</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#servicetype-v1-core">Kubernetes core/v1.ServiceType</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional service type for Kubernetes solver service</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>class</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress class to use when creating Ingress resources to solve ACME challenges that use this challenge solver. Only one of &lsquo;class&rsquo; or &lsquo;name&rsquo; may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>name</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The name of the ingress resource that should have ACME challenge solving routes inserted into it in order to solve HTTP01 challenges. This is typically used in conjunction with ingress controllers like ingress-gce, which maintains a 1:1 mapping between external IPs and ingress resources.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>podTemplate</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional pod template used to configure the ACME challenge solver pods used for HTTP01 challenges</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ingressTemplate</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional ingress template used to configure the ACME challenge solver ingress used for HTTP01 challenges</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressObjectMeta">ACMEChallengeSolverHTTP01IngressObjectMeta</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>annotations</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Annotations that should be added to the created ACME HTTP01 solver ingress.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>labels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Labels that should be added to the created ACME HTTP01 solver ingress.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>annotations</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Annotations that should be added to the create ACME HTTP01 solver pods.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>labels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Labels that should be added to the created ACME HTTP01 solver pods.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nodeSelector</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>affinity</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s scheduling constraints</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tolerations</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s tolerations.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>priorityClassName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s priorityClassName.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>serviceAccountName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s service account</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ObjectMeta overrides for the pod used to solve HTTP01 challenges. Only the &lsquo;labels&rsquo; and &lsquo;annotations&rsquo; fields may be set. If labels or annotations overlap with in-built values, the values here will override the in-built values.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PodSpec defines overrides for the HTTP01 challenge solver pod. Only the &lsquo;priorityClassName&rsquo;, &lsquo;nodeSelector&rsquo;, &lsquo;affinity&rsquo;, &lsquo;serviceAccountName&rsquo; and &lsquo;tolerations&rsquo; fields are supported currently. All other fields will be ignored.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>nodeSelector</code>
              <br />
              <em>map[string]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>affinity</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s scheduling constraints</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>tolerations</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s tolerations.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>priorityClassName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s priorityClassName.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>serviceAccountName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s service account</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverHTTP01IngressObjectMeta">ACMEChallengeSolverHTTP01IngressObjectMeta</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ObjectMeta overrides for the ingress used to solve HTTP01 challenges. Only the &lsquo;labels&rsquo; and &lsquo;annotations&rsquo; fields may be set. If labels or annotations overlap with in-built values, the values here will override the in-built values.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEChallengeType"> ACMEChallengeType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ChallengeSpec">ChallengeSpec</a>) </p>
<div>
  <p>The type of ACME challenge. Only http-01 and dns-01 are supported.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;dns-01&#34;</p>
      </td>
      <td>
        <p> ACMEChallengeTypeDNS01 denotes a Challenge is of type dns-01 More info: <a href="https://letsencrypt.org/docs/challenge-types/#dns-01-challenge">https://letsencrypt.org/docs/challenge-types/#dns-01-challenge</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;http-01&#34;</p>
      </td>
      <td>
        <p> ACMEChallengeTypeHTTP01 denotes a Challenge is of type http-01 More info: <a href="https://letsencrypt.org/docs/challenge-types/#http-01-challenge">https://letsencrypt.org/docs/challenge-types/#http-01-challenge</a> </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEExternalAccountBinding">ACMEExternalAccountBinding</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuer">ACMEIssuer</a>) </p>
<div>
  <p>ACMEExternalAccountBinding is a reference to a CA external account of the ACME server.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>keyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>keyID is the ID of the CA key that the External Account is bound to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> keySecretRef is a Secret Key Selector referencing a data item in a Kubernetes Secret which holds the symmetric MAC key of the External Account Binding. The <code>key</code> is the index string that is paired with the key data in the Secret and should not be confused with the key data itself, or indeed with the External Account Binding keyID above. The secret key stored in the Secret <strong>must</strong> be un-padded, base64 URL encoded data. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyAlgorithm</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.HMACKeyAlgorithm">HMACKeyAlgorithm</a>
        </em>
      </td>
      <td>
        <p>keyAlgorithm is the MAC key algorithm that the key is used for. Valid values are &ldquo;HS256&rdquo;, &ldquo;HS384&rdquo; and &ldquo;HS512&rdquo;.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuer">ACMEIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>ACMEIssuer contains the specification for an ACME issuer. This uses the RFC8555 specification to obtain certificates by completing &lsquo;challenges&rsquo; to prove ownership of domain identifiers. Earlier draft versions of the ACME specification are not supported.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Email is the email address to be associated with the ACME account. This field is optional, but it is strongly recommended to be set. It will be used to contact you in case of issues with your account or certificates, including expiry notification emails. This field may be updated after the account is initially registered.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Server is the URL used to access the ACME server&rsquo;s &lsquo;directory&rsquo; endpoint. For example, for Let&rsquo;s Encrypt&rsquo;s staging endpoint, you would use: &ldquo;<a href='https://acme-staging-v02.api.letsencrypt.org/directory"'>https://acme-staging-v02.api.letsencrypt.org/directory&rdquo;</a>. Only ACME v2 endpoints (i.e. RFC 8555) are supported. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>preferredChain</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PreferredChain is the chain to use if the ACME server outputs multiple. PreferredChain is no guarantee that this one gets delivered by the ACME endpoint. For example, for Let&rsquo;s Encrypt&rsquo;s DST crosssign you would use: &ldquo;DST Root CA X3&rdquo; or &ldquo;ISRG Root X1&rdquo; for the newer Let&rsquo;s Encrypt root CA. This value picks the first certificate bundle in the ACME alternative chains that has a certificate with this value as its issuer&rsquo;s CN</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>skipTLSVerify</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Enables or disables validation of the ACME server TLS certificate. If true, requests to the ACME server will not have their TLS certificate validated (i.e. insecure connections will be allowed). Only enable this option in development environments. The cert-manager system installed roots will be used to verify connections to the ACME server if this is false. Defaults to false.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>externalAccountBinding</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ExternalAccountBinding is a reference to a CA external account of the ACME server. If set, upon registration cert-manager will attempt to associate the given external account credentials with the registered ACME account.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>privateKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> PrivateKey is the name of a Kubernetes Secret resource that will be used to store the automatically generated ACME account private key. Optionally, a <code>key</code> may be specified to select a specific entry within the named Secret resource. If <code>key</code> is not specified, a default of <code>tls.key</code> will be used. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solvers</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">[]ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Solvers is a list of challenge solvers that will be used to solve ACME challenges for the matching domains. Solver configurations must be provided in order to obtain certificates from an ACME server. For more information, see: <a href="https://cert-manager.io/docs/configuration/acme/">https://cert-manager.io/docs/configuration/acme/</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>disableAccountKeyGeneration</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Enables or disables generating a new ACME account key. If true, the Issuer resource will <em>not</em> request a new account but will expect the account key to be supplied via an existing secret. If false, the cert-manager system will generate a new ACME account key for the Issuer. Defaults to false. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>enableDurationFeature</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Enables requesting a Not After date on certificates that matches the duration of the certificate. This is not supported by all ACME servers like Let&rsquo;s Encrypt. If set to true when the ACME server does not support it it will create an error on the Order. Defaults to false.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAcmeDNS is a structure containing the configuration for ACME-DNS servers</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>host</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAkamai is a structure containing the DNS configuration for Akamai DNS—Zone Record Management API</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceConsumerDomain</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accessTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAzureDNS is a structure containing the configuration for Azure DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>clientID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>if both this and ClientSecret are left unset MSI will be used</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>if both this and ClientID are left unset MSI will be used</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>subscriptionID</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>tenantID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>when specifying ClientID and ClientSecret then this field is also needed</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>resourceGroupName</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>environment</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.AzureDNSEnvironment">AzureDNSEnvironment</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderCloudDNS is a structure containing the DNS configuration for Google Cloud DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceAccountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>project</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>HostedZoneName is an optional field that tells cert-manager in which Cloud DNS zone the challenge record has to be created. If left empty cert-manager will automatically choose a zone.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p> ACMEIssuerDNS01ProviderCloudflare is a structure containing the DNS configuration for Cloudflare. One of <code>apiKeySecretRef</code> or <code>apiTokenSecretRef</code> must be provided. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Email of the account, only required when using API key based authentication.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>API key to use to authenticate with Cloudflare. Note: using an API token to authenticate is now the recommended method as it allows greater control of permissions.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>API token used to authenticate with Cloudflare.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderDigitalOcean is a structure containing the DNS configuration for DigitalOcean Domains</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRFC2136 is a structure containing the configuration for RFC2136 DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nameserver</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The IP address or hostname of an authoritative DNS server supporting RFC2136 in the form host:port. If the host is an IPv6 address it must be enclosed in square brackets (e.g [2001:db8::1]) ; port is optional. This field is required.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The name of the secret containing the TSIG value. If <code>tsigKeyName</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigKeyName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Key name configured in the DNS. If <code>tsigSecretSecretRef</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigAlgorithm</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Algorithm configured in the DNS supporting RFC2136. Used only when <code>tsigSecretSecretRef</code> and <code>tsigKeyName</code> are defined. Supported values are (case-insensitive): <code>HMACMD5</code> (default), <code>HMACSHA1</code>, <code>HMACSHA256</code> or <code>HMACSHA512</code>. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRoute53 is a structure containing the Route 53 configuration for AWS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>accessKeyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The AccessKeyID is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata see: <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretAccessKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The SecretAccessKey is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata
          <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a>
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Role is a Role ARN which the Route53 provider will assume using either the explicit credentials AccessKeyID/SecretAccessKey or the inferred credentials from environment variables, shared credentials file or AWS Instance metadata</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If set, the provider will manage only this zone in Route53 and will not do an lookup using the route53:ListHostedZonesByName api call.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>region</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Always set the region when using AccessKeyID and SecretAccessKey</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderWebhook specifies configuration for a webhook DNS01 provider, including where to POST ChallengePayload resources.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>groupName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The API group name that should be used when POSTing ChallengePayload resources to the webhook apiserver. This should be the same as the GroupName specified in the webhook provider implementation.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solverName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The name of the solver to use, as defined in the webhook provider implementation. This will typically be the name of the provider, e.g. &lsquo;cloudflare&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>config</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#json-v1beta1-apiextensions">Kubernetes apiextensions/v1beta1.JSON</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Additional configuration that should be passed to the webhook apiserver when challenges are processed. This can contain arbitrary JSON data. Secret values should not be specified in this stanza. If secret values are needed (e.g. credentials for a DNS service), you should use a SecretKeySelector to reference a Secret resource. For details on the schema of this field, consult the webhook provider implementation&rsquo;s documentation.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ACMEIssuerStatus">ACMEIssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerStatus">IssuerStatus</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>uri</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URI is the unique account identifier, which can also be used to retrieve account details from the CA</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastRegisteredEmail</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastRegisteredEmail is the email associated with the latest registered ACME account, in order to track changes made to registered account associated with the Issuer</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.AzureDNSEnvironment"> AzureDNSEnvironment (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;AzureChinaCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureGermanCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzurePublicCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureUSGovernmentCloud&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.CNAMEStrategy"> CNAMEStrategy (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones. By default, the None strategy will be applied (i.e. do not follow CNAMEs).</p>
</div>
<h3 id="acme.cert-manager.io/v1alpha2.CertificateDNSNameSelector">CertificateDNSNameSelector</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>CertificateDomainSelector selects certificates using a label selector, and can optionally select individual DNS names within those certificates. If both MatchLabels and DNSNames are empty, this selector will match all certificates and DNS names within them.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>matchLabels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>A label selector that is used to refine the set of certificate&rsquo;s that this challenge solver will apply to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSNames that this solver will be used to solve. If specified and a match is found, a dnsNames selector will take precedence over a dnsZones selector. If multiple solvers match with the same dnsNames value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsZones</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSZones that this solver will be used to solve. The most specific DNS zone match specified here will take precedence over other DNS zone matches, so a solver specifying sys.example.com will be selected over one specifying example.com for the domain www.sys.example.com. If multiple solvers match with the same dnsZones value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ChallengeSpec">ChallengeSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>authzURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>AuthzURL is the URL to the ACME Authorization resource that this challenge is a part of.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> DNSName is the identifier that this challenge is for, e.g. example.com. If the requested DNSName is a &lsquo;wildcard&rsquo;, this field MUST be set to the non-wildcard domain, e.g. for <code>*.example.com</code>, it must be <code>example.com</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeType">ACMEChallengeType</a>
        </em>
      </td>
      <td>
        <p>Type is the type of ACME challenge this resource represents. One of &ldquo;http-01&rdquo; or &ldquo;dns-01&rdquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Token is the ACME challenge token for this challenge. This is the raw value returned from the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>key</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>
          Key is the ACME challenge key for this challenge For HTTP01 challenges, this is the value that must be responded with to complete the HTTP01 challenge in the format:
          <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>. For DNS01 challenges, this is the base64 encoded SHA256 sum of the
          <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>
          text that must be set as the TXT record content.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solver</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEChallengeSolver">ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <p>Solver contains the domain solving configuration that should be used to solve this challenge resource.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.ChallengeStatus">ChallengeStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>processing</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Processing is used to denote whether this challenge should be processed or not. This field will only be set to true by the &lsquo;scheduling&rsquo; component. It will only be set to false by the &lsquo;challenges&rsquo; controller, after the challenge has reached a final state or timed out. If this field is set to false, the challenge controller will not take any more action.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>presented</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Presented will be set to true if the challenge values for this challenge are currently &lsquo;presented&rsquo;. This <em>does not</em> imply the self check is passing. Only that the values have been &lsquo;submitted&rsquo; for the appropriate challenge mechanism (i.e. the DNS01 TXT record has been presented, or the HTTP01 configuration has been configured). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason contains human readable information on why the Challenge is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State contains the current &lsquo;state&rsquo; of the challenge. If not set, the state of the challenge is unknown.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.HMACKeyAlgorithm"> HMACKeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>) </p>
<div>
  <p>HMACKeyAlgorithm is the name of a key algorithm used for HMAC encryption</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;HS256&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS384&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS512&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.OrderSpec">OrderSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>csr</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> CommonName is the common name as specified on the DER encoded CSR. If specified, this value must also be present in <code>dnsNames</code> or <code>ipAddresses</code>. This field must match the corresponding field on the DER encoded CSR. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ipAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IPAddresses is a list of IP addresses that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Duration is the duration for the not after date for the requested certificate. this is set on order creation as pe the ACME spec.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.OrderStatus">OrderStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URL of the Order. This will initially be empty when the resource is first created. The Order controller will populate this field when the Order is first processed. This field will be immutable after it is initially set.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>finalizeURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FinalizeURL of the Order. This is used to obtain certificates for this order once it has been completed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>authorizations</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEAuthorization">[]ACMEAuthorization</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Authorizations contains data returned from the ACME server on what authorizations must be completed in order to validate the DNS names specified on the Order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Certificate is a copy of the PEM encoded certificate for this Order. This field will be populated after the order has been successfully finalized with the ACME server, and the order has transitioned to the &lsquo;valid&rsquo; state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State contains the current state of this Order resource. States &lsquo;success&rsquo; and &lsquo;expired&rsquo; are &lsquo;final&rsquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason optionally provides more information about a why the order is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this order failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha2.State"> State (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha2.ACMEAuthorization">ACMEAuthorization</a>, <a href="#acme.cert-manager.io/v1alpha2.ChallengeStatus">ChallengeStatus</a>, <a href="#acme.cert-manager.io/v1alpha2.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>
    State represents the state of an ACME resource, such as an Order. The possible options here map to the corresponding values in the ACME specification. Full details of these values can be found here: <a href="https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6">https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6</a>
    Clients utilising this type must also gracefully handle unknown values, as the contents of this enumeration may be added to over time.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;errored&#34;</p>
      </td>
      <td>
        <p>Errored signifies that the ACME resource has errored for some reason. This is a catch-all state, and is used for marking internal cert-manager errors such as validation failures. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;expired&#34;</p>
      </td>
      <td>
        <p>Expired signifies that an ACME resource has expired. If an Order is marked &lsquo;Expired&rsquo;, one of its validations may have expired or the Order itself. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;invalid&#34;</p>
      </td>
      <td>
        <p>Invalid signifies that an ACME resource is invalid for some reason. If an Order is marked &lsquo;invalid&rsquo;, one of its validations be have invalid for some reason. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;pending&#34;</p>
      </td>
      <td>
        <p>Pending signifies that an ACME resource is still pending and is not yet ready. If an Order is marked &lsquo;Pending&rsquo;, the validations for that Order are still in progress. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;processing&#34;</p>
      </td>
      <td>
        <p>Processing signifies that an ACME resource is being processed by the server. If an Order is marked &lsquo;Processing&rsquo;, the validations for that Order are currently being processed. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;ready&#34;</p>
      </td>
      <td>
        <p>Ready signifies that an ACME resource is in a ready state. If an order is &lsquo;ready&rsquo;, all of its challenges have been completed successfully and the order is ready to be finalized. Once finalized, it will transition to the Valid state. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;&#34;</p>
      </td>
      <td>
        <p>Unknown is not a real state as part of the ACME spec. It is used to represent an unrecognised value.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;valid&#34;</p>
      </td>
      <td>
        <p>Valid signifies that an ACME resource is in a valid state. If an order is &lsquo;valid&rsquo;, it has been finalized with the ACME server and the certificate can be retrieved from the ACME server using the certificate URL stored in the Order&rsquo;s status subresource. This is a final state.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="acme.cert-manager.io/v1alpha3">acme.cert-manager.io/v1alpha3</h2>
<div>
  <p>Package v1alpha3 is the v1alpha3 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#acme.cert-manager.io/v1alpha3.Challenge">Challenge</a>
  </li>
  <li>
    <a href="#acme.cert-manager.io/v1alpha3.Order">Order</a>
  </li>
</ul>
<h3 id="acme.cert-manager.io/v1alpha3.Challenge">Challenge</h3>
<div>
  <p>Challenge is a type to represent a Challenge request with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Challenge</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ChallengeSpec">ChallengeSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>url</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>URL is the URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>authzURL</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>AuthzURL is the URL to the ACME Authorization resource that this challenge is a part of.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p> DNSName is the identifier that this challenge is for, e.g. example.com. If the requested DNSName is a &lsquo;wildcard&rsquo;, this field MUST be set to the non-wildcard domain, e.g. for <code>*.example.com</code>, it must be <code>example.com</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>wildcard</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>type</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeType">ACMEChallengeType</a>
              </em>
            </td>
            <td>
              <p>Type is the type of ACME challenge this resource represents. One of &ldquo;http-01&rdquo; or &ldquo;dns-01&rdquo;.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>token</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>Token is the ACME challenge token for this challenge. This is the raw value returned from the ACME server.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>key</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>
                Key is the ACME challenge key for this challenge For HTTP01 challenges, this is the value that must be responded with to complete the HTTP01 challenge in the format:
                <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>. For DNS01 challenges, this is the base64 encoded SHA256 sum of the
                <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>
                text that must be set as the TXT record content.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>solver</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</a>
              </em>
            </td>
            <td>
              <p>Solver contains the domain solving configuration that should be used to solve this challenge resource.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ChallengeStatus">ChallengeStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.Order">Order</h3>
<div>
  <p>Order is a type to represent an Order with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Order</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.OrderSpec">OrderSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>csr</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> CommonName is the common name as specified on the DER encoded CSR. If specified, this value must also be present in <code>dnsNames</code> or <code>ipAddresses</code>. This field must match the corresponding field on the DER encoded CSR. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>ipAddresses</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IPAddresses is a list of IP addresses that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Duration is the duration for the not after date for the requested certificate. this is set on order creation as pe the ACME spec.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.OrderStatus">OrderStatus</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEAuthorization">ACMEAuthorization</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>ACMEAuthorization contains data returned from the ACME server on an authorization that must be completed in order validate a DNS name on an ACME Order resource.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of the Authorization that must be completed</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>identifier</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Identifier is the DNS name to be validated as part of this authorization</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Wildcard will be true if this authorization is for a wildcard DNS name. If this is true, the identifier will be the <em>non-wildcard</em> version of the DNS name. For example, if &lsquo;*.example.com&rsquo; is the DNS name being validated, this field will be &lsquo;true&rsquo; and the &lsquo;identifier&rsquo; field will be &lsquo;example.com&rsquo;. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>initialState</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>InitialState is the initial state of the ACME authorization when first fetched from the ACME server. If an Authorization is already &lsquo;valid&rsquo;, the Order controller will not create a Challenge resource for the authorization. This will occur when working with an ACME server that enables &lsquo;authz reuse&rsquo; (such as Let&rsquo;s Encrypt&rsquo;s production endpoint). If not set and &lsquo;identifier&rsquo; is set, the state is assumed to be pending and a Challenge will be created.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>challenges</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallenge">[]ACMEChallenge</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Challenges specifies the challenge types offered by the ACME server. One of these challenge types will be selected when validating the DNS name and an appropriate Challenge resource will be created to perform the ACME challenge process.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallenge">ACMEChallenge</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEAuthorization">ACMEAuthorization</a>) </p>
<div>
  <p>Challenge specifies a challenge offered by the ACME server for an Order. An appropriate Challenge resource can be created to perform the ACME challenge process.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of this challenge. It can be used to retrieve additional metadata about the Challenge from the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Token is the token that must be presented for this challenge. This is used to compute the &lsquo;key&rsquo; that must also be presented.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Type is the type of challenge being offered, e.g. &lsquo;http-01&rsquo;, &lsquo;dns-01&rsquo;, &lsquo;tls-sni-01&rsquo;, etc. This is the raw value retrieved from the ACME server. Only &lsquo;http-01&rsquo; and &lsquo;dns-01&rsquo; are supported by cert-manager, other values will be ignored.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1alpha3.ChallengeSpec">ChallengeSpec</a>) </p>
<div>
  <p>Configures an issuer to solve challenges using the specified options. Only one of HTTP01 or DNS01 may be provided.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>selector</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.CertificateDNSNameSelector">CertificateDNSNameSelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Selector selects a set of DNSNames on the Certificate resource that should be solved using this challenge solver. If not specified, the solver will be treated as the &lsquo;default&rsquo; solver with the lowest priority, i.e. if any other solver has a more specific match, it will be used instead.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>http01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Configures cert-manager to attempt to complete authorizations by performing the HTTP01 challenge flow. It is not possible to obtain certificates for wildcard domain names (e.g. <code>*.example.com</code>) using the HTTP01 challenge mechanism. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dns01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Configures cert-manager to attempt to complete authorizations by performing the DNS01 challenge flow.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>Used to configure a DNS01 challenge provider to be used when solving DNS01 challenges. Only one DNS provider may be configured per solver.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>cnameStrategy</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.CNAMEStrategy">CNAMEStrategy</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>akamai</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Akamai DNS zone management API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>clouddns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Google Cloud DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloudflare</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Cloudflare API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>route53</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the AWS Route53 API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>azuredns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Microsoft Azure DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>digitalocean</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the DigitalOcean DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>acmedns</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Use the &lsquo;ACME DNS&rsquo; (<a href="https://github.com/joohoi/acme-dns">https://github.com/joohoi/acme-dns</a>) API to manage DNS01 challenge records. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>rfc2136</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Use RFC2136 (&ldquo;Dynamic Updates in the Domain Name System&rdquo;) (<a href="https://datatracker.ietf.org/doc/rfc2136/">https://datatracker.ietf.org/doc/rfc2136/</a>) to manage DNS01 challenge records. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>webhook</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Configure an external webhook based DNS01 challenge solver to manage DNS01 challenge records.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>ACMEChallengeSolverHTTP01 contains configuration detailing how to solve HTTP01 challenges within a Kubernetes cluster. Typically this is accomplished through creating &lsquo;routes&rsquo; of some description that configure ingress controllers to direct traffic to &lsquo;solver pods&rsquo;, which are responsible for responding to the ACME server&rsquo;s HTTP requests.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>ingress</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress based HTTP01 challenge solver will solve challenges by creating or modifying Ingress resources in order to route requests for &lsquo;/.well-known/acme-challenge/XYZ&rsquo; to &lsquo;challenge solver&rsquo; pods that are provisioned by cert-manager for each Challenge to be completed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceType</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#servicetype-v1-core">Kubernetes core/v1.ServiceType</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional service type for Kubernetes solver service</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>class</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress class to use when creating Ingress resources to solve ACME challenges that use this challenge solver. Only one of &lsquo;class&rsquo; or &lsquo;name&rsquo; may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>name</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The name of the ingress resource that should have ACME challenge solving routes inserted into it in order to solve HTTP01 challenges. This is typically used in conjunction with ingress controllers like ingress-gce, which maintains a 1:1 mapping between external IPs and ingress resources.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>podTemplate</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional pod template used to configure the ACME challenge solver pods used for HTTP01 challenges</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ingressTemplate</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional ingress template used to configure the ACME challenge solver ingress used for HTTP01 challenges</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressObjectMeta">ACMEChallengeSolverHTTP01IngressObjectMeta</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>annotations</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Annotations that should be added to the created ACME HTTP01 solver ingress.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>labels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Labels that should be added to the created ACME HTTP01 solver ingress.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>annotations</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Annotations that should be added to the create ACME HTTP01 solver pods.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>labels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Labels that should be added to the created ACME HTTP01 solver pods.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nodeSelector</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>affinity</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s scheduling constraints</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tolerations</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s tolerations.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>priorityClassName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s priorityClassName.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>serviceAccountName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s service account</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ObjectMeta overrides for the pod used to solve HTTP01 challenges. Only the &lsquo;labels&rsquo; and &lsquo;annotations&rsquo; fields may be set. If labels or annotations overlap with in-built values, the values here will override the in-built values.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PodSpec defines overrides for the HTTP01 challenge solver pod. Only the &lsquo;priorityClassName&rsquo;, &lsquo;nodeSelector&rsquo;, &lsquo;affinity&rsquo;, &lsquo;serviceAccountName&rsquo; and &lsquo;tolerations&rsquo; fields are supported currently. All other fields will be ignored.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>nodeSelector</code>
              <br />
              <em>map[string]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>affinity</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s scheduling constraints</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>tolerations</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s tolerations.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>priorityClassName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s priorityClassName.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>serviceAccountName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s service account</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverHTTP01IngressObjectMeta">ACMEChallengeSolverHTTP01IngressObjectMeta</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ObjectMeta overrides for the ingress used to solve HTTP01 challenges. Only the &lsquo;labels&rsquo; and &lsquo;annotations&rsquo; fields may be set. If labels or annotations overlap with in-built values, the values here will override the in-built values.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEChallengeType"> ACMEChallengeType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ChallengeSpec">ChallengeSpec</a>) </p>
<div>
  <p>The type of ACME challenge. Only http-01 and dns-01 are supported.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;dns-01&#34;</p>
      </td>
      <td>
        <p> ACMEChallengeTypeDNS01 denotes a Challenge is of type dns-01 More info: <a href="https://letsencrypt.org/docs/challenge-types/#dns-01-challenge">https://letsencrypt.org/docs/challenge-types/#dns-01-challenge</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;http-01&#34;</p>
      </td>
      <td>
        <p> ACMEChallengeTypeHTTP01 denotes a Challenge is of type http-01 More info: <a href="https://letsencrypt.org/docs/challenge-types/#http-01-challenge">https://letsencrypt.org/docs/challenge-types/#http-01-challenge</a> </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEExternalAccountBinding">ACMEExternalAccountBinding</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuer">ACMEIssuer</a>) </p>
<div>
  <p>ACMEExternalAccountBinding is a reference to a CA external account of the ACME server.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>keyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>keyID is the ID of the CA key that the External Account is bound to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> keySecretRef is a Secret Key Selector referencing a data item in a Kubernetes Secret which holds the symmetric MAC key of the External Account Binding. The <code>key</code> is the index string that is paired with the key data in the Secret and should not be confused with the key data itself, or indeed with the External Account Binding keyID above. The secret key stored in the Secret <strong>must</strong> be un-padded, base64 URL encoded data. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyAlgorithm</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.HMACKeyAlgorithm">HMACKeyAlgorithm</a>
        </em>
      </td>
      <td>
        <p>keyAlgorithm is the MAC key algorithm that the key is used for. Valid values are &ldquo;HS256&rdquo;, &ldquo;HS384&rdquo; and &ldquo;HS512&rdquo;.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuer">ACMEIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>ACMEIssuer contains the specification for an ACME issuer. This uses the RFC8555 specification to obtain certificates by completing &lsquo;challenges&rsquo; to prove ownership of domain identifiers. Earlier draft versions of the ACME specification are not supported.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Email is the email address to be associated with the ACME account. This field is optional, but it is strongly recommended to be set. It will be used to contact you in case of issues with your account or certificates, including expiry notification emails. This field may be updated after the account is initially registered.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Server is the URL used to access the ACME server&rsquo;s &lsquo;directory&rsquo; endpoint. For example, for Let&rsquo;s Encrypt&rsquo;s staging endpoint, you would use: &ldquo;<a href='https://acme-staging-v02.api.letsencrypt.org/directory"'>https://acme-staging-v02.api.letsencrypt.org/directory&rdquo;</a>. Only ACME v2 endpoints (i.e. RFC 8555) are supported. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>preferredChain</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PreferredChain is the chain to use if the ACME server outputs multiple. PreferredChain is no guarantee that this one gets delivered by the ACME endpoint. For example, for Let&rsquo;s Encrypt&rsquo;s DST crosssign you would use: &ldquo;DST Root CA X3&rdquo; or &ldquo;ISRG Root X1&rdquo; for the newer Let&rsquo;s Encrypt root CA. This value picks the first certificate bundle in the ACME alternative chains that has a certificate with this value as its issuer&rsquo;s CN</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>skipTLSVerify</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Enables or disables validation of the ACME server TLS certificate. If true, requests to the ACME server will not have their TLS certificate validated (i.e. insecure connections will be allowed). Only enable this option in development environments. The cert-manager system installed roots will be used to verify connections to the ACME server if this is false. Defaults to false.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>externalAccountBinding</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ExternalAccountBinding is a reference to a CA external account of the ACME server. If set, upon registration cert-manager will attempt to associate the given external account credentials with the registered ACME account.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>privateKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> PrivateKey is the name of a Kubernetes Secret resource that will be used to store the automatically generated ACME account private key. Optionally, a <code>key</code> may be specified to select a specific entry within the named Secret resource. If <code>key</code> is not specified, a default of <code>tls.key</code> will be used. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solvers</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">[]ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Solvers is a list of challenge solvers that will be used to solve ACME challenges for the matching domains. Solver configurations must be provided in order to obtain certificates from an ACME server. For more information, see: <a href="https://cert-manager.io/docs/configuration/acme/">https://cert-manager.io/docs/configuration/acme/</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>disableAccountKeyGeneration</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Enables or disables generating a new ACME account key. If true, the Issuer resource will <em>not</em> request a new account but will expect the account key to be supplied via an existing secret. If false, the cert-manager system will generate a new ACME account key for the Issuer. Defaults to false. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>enableDurationFeature</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Enables requesting a Not After date on certificates that matches the duration of the certificate. This is not supported by all ACME servers like Let&rsquo;s Encrypt. If set to true when the ACME server does not support it it will create an error on the Order. Defaults to false.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAcmeDNS is a structure containing the configuration for ACME-DNS servers</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>host</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAkamai is a structure containing the DNS configuration for Akamai DNS—Zone Record Management API</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceConsumerDomain</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accessTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAzureDNS is a structure containing the configuration for Azure DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>clientID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>if both this and ClientSecret are left unset MSI will be used</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>if both this and ClientID are left unset MSI will be used</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>subscriptionID</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>tenantID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>when specifying ClientID and ClientSecret then this field is also needed</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>resourceGroupName</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>environment</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.AzureDNSEnvironment">AzureDNSEnvironment</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderCloudDNS is a structure containing the DNS configuration for Google Cloud DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceAccountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>project</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>HostedZoneName is an optional field that tells cert-manager in which Cloud DNS zone the challenge record has to be created. If left empty cert-manager will automatically choose a zone.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p> ACMEIssuerDNS01ProviderCloudflare is a structure containing the DNS configuration for Cloudflare. One of <code>apiKeySecretRef</code> or <code>apiTokenSecretRef</code> must be provided. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Email of the account, only required when using API key based authentication.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>API key to use to authenticate with Cloudflare. Note: using an API token to authenticate is now the recommended method as it allows greater control of permissions.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>API token used to authenticate with Cloudflare.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderDigitalOcean is a structure containing the DNS configuration for DigitalOcean Domains</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRFC2136 is a structure containing the configuration for RFC2136 DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nameserver</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The IP address or hostname of an authoritative DNS server supporting RFC2136 in the form host:port. If the host is an IPv6 address it must be enclosed in square brackets (e.g [2001:db8::1]) ; port is optional. This field is required.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The name of the secret containing the TSIG value. If <code>tsigKeyName</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigKeyName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Key name configured in the DNS. If <code>tsigSecretSecretRef</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigAlgorithm</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Algorithm configured in the DNS supporting RFC2136. Used only when <code>tsigSecretSecretRef</code> and <code>tsigKeyName</code> are defined. Supported values are (case-insensitive): <code>HMACMD5</code> (default), <code>HMACSHA1</code>, <code>HMACSHA256</code> or <code>HMACSHA512</code>. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRoute53 is a structure containing the Route 53 configuration for AWS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>accessKeyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The AccessKeyID is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata see: <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretAccessKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The SecretAccessKey is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata
          <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a>
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Role is a Role ARN which the Route53 provider will assume using either the explicit credentials AccessKeyID/SecretAccessKey or the inferred credentials from environment variables, shared credentials file or AWS Instance metadata</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If set, the provider will manage only this zone in Route53 and will not do an lookup using the route53:ListHostedZonesByName api call.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>region</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Always set the region when using AccessKeyID and SecretAccessKey</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderWebhook specifies configuration for a webhook DNS01 provider, including where to POST ChallengePayload resources.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>groupName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The API group name that should be used when POSTing ChallengePayload resources to the webhook apiserver. This should be the same as the GroupName specified in the webhook provider implementation.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solverName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The name of the solver to use, as defined in the webhook provider implementation. This will typically be the name of the provider, e.g. &lsquo;cloudflare&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>config</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#json-v1beta1-apiextensions">Kubernetes apiextensions/v1beta1.JSON</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Additional configuration that should be passed to the webhook apiserver when challenges are processed. This can contain arbitrary JSON data. Secret values should not be specified in this stanza. If secret values are needed (e.g. credentials for a DNS service), you should use a SecretKeySelector to reference a Secret resource. For details on the schema of this field, consult the webhook provider implementation&rsquo;s documentation.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ACMEIssuerStatus">ACMEIssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerStatus">IssuerStatus</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>uri</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URI is the unique account identifier, which can also be used to retrieve account details from the CA</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastRegisteredEmail</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastRegisteredEmail is the email associated with the latest registered ACME account, in order to track changes made to registered account associated with the Issuer</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.AzureDNSEnvironment"> AzureDNSEnvironment (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;AzureChinaCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureGermanCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzurePublicCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureUSGovernmentCloud&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.CNAMEStrategy"> CNAMEStrategy (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones. By default, the None strategy will be applied (i.e. do not follow CNAMEs).</p>
</div>
<h3 id="acme.cert-manager.io/v1alpha3.CertificateDNSNameSelector">CertificateDNSNameSelector</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>CertificateDomainSelector selects certificates using a label selector, and can optionally select individual DNS names within those certificates. If both MatchLabels and DNSNames are empty, this selector will match all certificates and DNS names within them.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>matchLabels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>A label selector that is used to refine the set of certificate&rsquo;s that this challenge solver will apply to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSNames that this solver will be used to solve. If specified and a match is found, a dnsNames selector will take precedence over a dnsZones selector. If multiple solvers match with the same dnsNames value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsZones</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSZones that this solver will be used to solve. The most specific DNS zone match specified here will take precedence over other DNS zone matches, so a solver specifying sys.example.com will be selected over one specifying example.com for the domain www.sys.example.com. If multiple solvers match with the same dnsZones value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ChallengeSpec">ChallengeSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>authzURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>AuthzURL is the URL to the ACME Authorization resource that this challenge is a part of.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> DNSName is the identifier that this challenge is for, e.g. example.com. If the requested DNSName is a &lsquo;wildcard&rsquo;, this field MUST be set to the non-wildcard domain, e.g. for <code>*.example.com</code>, it must be <code>example.com</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeType">ACMEChallengeType</a>
        </em>
      </td>
      <td>
        <p>Type is the type of ACME challenge this resource represents. One of &ldquo;http-01&rdquo; or &ldquo;dns-01&rdquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Token is the ACME challenge token for this challenge. This is the raw value returned from the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>key</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>
          Key is the ACME challenge key for this challenge For HTTP01 challenges, this is the value that must be responded with to complete the HTTP01 challenge in the format:
          <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>. For DNS01 challenges, this is the base64 encoded SHA256 sum of the
          <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>
          text that must be set as the TXT record content.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solver</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEChallengeSolver">ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <p>Solver contains the domain solving configuration that should be used to solve this challenge resource.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.ChallengeStatus">ChallengeStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>processing</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Processing is used to denote whether this challenge should be processed or not. This field will only be set to true by the &lsquo;scheduling&rsquo; component. It will only be set to false by the &lsquo;challenges&rsquo; controller, after the challenge has reached a final state or timed out. If this field is set to false, the challenge controller will not take any more action.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>presented</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Presented will be set to true if the challenge values for this challenge are currently &lsquo;presented&rsquo;. This <em>does not</em> imply the self check is passing. Only that the values have been &lsquo;submitted&rsquo; for the appropriate challenge mechanism (i.e. the DNS01 TXT record has been presented, or the HTTP01 configuration has been configured). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason contains human readable information on why the Challenge is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State contains the current &lsquo;state&rsquo; of the challenge. If not set, the state of the challenge is unknown.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.HMACKeyAlgorithm"> HMACKeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>) </p>
<div>
  <p>HMACKeyAlgorithm is the name of a key algorithm used for HMAC encryption</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;HS256&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS384&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS512&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.OrderSpec">OrderSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>csr</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> CommonName is the common name as specified on the DER encoded CSR. If specified, this value must also be present in <code>dnsNames</code> or <code>ipAddresses</code>. This field must match the corresponding field on the DER encoded CSR. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ipAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IPAddresses is a list of IP addresses that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Duration is the duration for the not after date for the requested certificate. this is set on order creation as pe the ACME spec.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.OrderStatus">OrderStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URL of the Order. This will initially be empty when the resource is first created. The Order controller will populate this field when the Order is first processed. This field will be immutable after it is initially set.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>finalizeURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FinalizeURL of the Order. This is used to obtain certificates for this order once it has been completed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>authorizations</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEAuthorization">[]ACMEAuthorization</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Authorizations contains data returned from the ACME server on what authorizations must be completed in order to validate the DNS names specified on the Order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Certificate is a copy of the PEM encoded certificate for this Order. This field will be populated after the order has been successfully finalized with the ACME server, and the order has transitioned to the &lsquo;valid&rsquo; state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State contains the current state of this Order resource. States &lsquo;success&rsquo; and &lsquo;expired&rsquo; are &lsquo;final&rsquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason optionally provides more information about a why the order is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this order failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1alpha3.State"> State (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1alpha3.ACMEAuthorization">ACMEAuthorization</a>, <a href="#acme.cert-manager.io/v1alpha3.ChallengeStatus">ChallengeStatus</a>, <a href="#acme.cert-manager.io/v1alpha3.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>
    State represents the state of an ACME resource, such as an Order. The possible options here map to the corresponding values in the ACME specification. Full details of these values can be found here: <a href="https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6">https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6</a>
    Clients utilising this type must also gracefully handle unknown values, as the contents of this enumeration may be added to over time.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;errored&#34;</p>
      </td>
      <td>
        <p>Errored signifies that the ACME resource has errored for some reason. This is a catch-all state, and is used for marking internal cert-manager errors such as validation failures. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;expired&#34;</p>
      </td>
      <td>
        <p>Expired signifies that an ACME resource has expired. If an Order is marked &lsquo;Expired&rsquo;, one of its validations may have expired or the Order itself. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;invalid&#34;</p>
      </td>
      <td>
        <p>Invalid signifies that an ACME resource is invalid for some reason. If an Order is marked &lsquo;invalid&rsquo;, one of its validations be have invalid for some reason. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;pending&#34;</p>
      </td>
      <td>
        <p>Pending signifies that an ACME resource is still pending and is not yet ready. If an Order is marked &lsquo;Pending&rsquo;, the validations for that Order are still in progress. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;processing&#34;</p>
      </td>
      <td>
        <p>Processing signifies that an ACME resource is being processed by the server. If an Order is marked &lsquo;Processing&rsquo;, the validations for that Order are currently being processed. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;ready&#34;</p>
      </td>
      <td>
        <p>Ready signifies that an ACME resource is in a ready state. If an order is &lsquo;ready&rsquo;, all of its challenges have been completed successfully and the order is ready to be finalized. Once finalized, it will transition to the Valid state. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;&#34;</p>
      </td>
      <td>
        <p>Unknown is not a real state as part of the ACME spec. It is used to represent an unrecognised value.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;valid&#34;</p>
      </td>
      <td>
        <p>Valid signifies that an ACME resource is in a valid state. If an order is &lsquo;valid&rsquo;, it has been finalized with the ACME server and the certificate can be retrieved from the ACME server using the certificate URL stored in the Order&rsquo;s status subresource. This is a final state.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="acme.cert-manager.io/v1beta1">acme.cert-manager.io/v1beta1</h2>
<div>
  <p>Package v1beta1 is the v1beta1 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#acme.cert-manager.io/v1beta1.Challenge">Challenge</a>
  </li>
  <li>
    <a href="#acme.cert-manager.io/v1beta1.Order">Order</a>
  </li>
</ul>
<h3 id="acme.cert-manager.io/v1beta1.Challenge">Challenge</h3>
<div>
  <p>Challenge is a type to represent a Challenge request with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1beta1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Challenge</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ChallengeSpec">ChallengeSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>url</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>The URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>authorizationURL</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>The URL to the ACME Authorization resource that this challenge is a part of.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p> dnsName is the identifier that this challenge is for, e.g. example.com. If the requested DNSName is a &lsquo;wildcard&rsquo;, this field MUST be set to the non-wildcard domain, e.g. for <code>*.example.com</code>, it must be <code>example.com</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>wildcard</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>type</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeType">ACMEChallengeType</a>
              </em>
            </td>
            <td>
              <p>The type of ACME challenge this resource represents. One of &ldquo;HTTP-01&rdquo; or &ldquo;DNS-01&rdquo;.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>token</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>The ACME challenge token for this challenge. This is the raw value returned from the ACME server.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>key</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>
                The ACME challenge key for this challenge For HTTP01 challenges, this is the value that must be responded with to complete the HTTP01 challenge in the format:
                <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>. For DNS01 challenges, this is the base64 encoded SHA256 sum of the
                <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>
                text that must be set as the TXT record content.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>solver</code>
              <br />
              <em>
                <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolver">ACMEChallengeSolver</a>
              </em>
            </td>
            <td>
              <p>Contains the domain solving configuration that should be used to solve this challenge resource.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>References a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ChallengeStatus">ChallengeStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.Order">Order</h3>
<div>
  <p>Order is a type to represent an Order with an ACME server</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>acme.cert-manager.io/v1beta1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Order</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.OrderSpec">OrderSpec</a>
        </em>
      </td>
      <td>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>request</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> CommonName is the common name as specified on the DER encoded CSR. If specified, this value must also be present in <code>dnsNames</code> or <code>ipAddresses</code>. This field must match the corresponding field on the DER encoded CSR. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>ipAddresses</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IPAddresses is a list of IP addresses that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Duration is the duration for the not after date for the requested certificate. this is set on order creation as pe the ACME spec.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.OrderStatus">OrderStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEAuthorization">ACMEAuthorization</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>ACMEAuthorization contains data returned from the ACME server on an authorization that must be completed in order validate a DNS name on an ACME Order resource.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of the Authorization that must be completed</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>identifier</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Identifier is the DNS name to be validated as part of this authorization</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Wildcard will be true if this authorization is for a wildcard DNS name. If this is true, the identifier will be the <em>non-wildcard</em> version of the DNS name. For example, if &lsquo;*.example.com&rsquo; is the DNS name being validated, this field will be &lsquo;true&rsquo; and the &lsquo;identifier&rsquo; field will be &lsquo;example.com&rsquo;. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>initialState</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>InitialState is the initial state of the ACME authorization when first fetched from the ACME server. If an Authorization is already &lsquo;valid&rsquo;, the Order controller will not create a Challenge resource for the authorization. This will occur when working with an ACME server that enables &lsquo;authz reuse&rsquo; (such as Let&rsquo;s Encrypt&rsquo;s production endpoint). If not set and &lsquo;identifier&rsquo; is set, the state is assumed to be pending and a Challenge will be created.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>challenges</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallenge">[]ACMEChallenge</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Challenges specifies the challenge types offered by the ACME server. One of these challenge types will be selected when validating the DNS name and an appropriate Challenge resource will be created to perform the ACME challenge process.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEChallenge">ACMEChallenge</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEAuthorization">ACMEAuthorization</a>) </p>
<div>
  <p>Challenge specifies a challenge offered by the ACME server for an Order. An appropriate Challenge resource can be created to perform the ACME challenge process.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>URL is the URL of this challenge. It can be used to retrieve additional metadata about the Challenge from the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Token is the token that must be presented for this challenge. This is used to compute the &lsquo;key&rsquo; that must also be presented.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Type is the type of challenge being offered, e.g. &lsquo;http-01&rsquo;, &lsquo;dns-01&rsquo;, &lsquo;tls-sni-01&rsquo;, etc. This is the raw value retrieved from the ACME server. Only &lsquo;http-01&rsquo; and &lsquo;dns-01&rsquo; are supported by cert-manager, other values will be ignored.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEChallengeSolver">ACMEChallengeSolver</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1beta1.ChallengeSpec">ChallengeSpec</a>) </p>
<div>
  <p>Configures an issuer to solve challenges using the specified options. Only one of HTTP01 or DNS01 may be provided.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>selector</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.CertificateDNSNameSelector">CertificateDNSNameSelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Selector selects a set of DNSNames on the Certificate resource that should be solved using this challenge solver. If not specified, the solver will be treated as the &lsquo;default&rsquo; solver with the lowest priority, i.e. if any other solver has a more specific match, it will be used instead.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>http01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Configures cert-manager to attempt to complete authorizations by performing the HTTP01 challenge flow. It is not possible to obtain certificates for wildcard domain names (e.g. <code>*.example.com</code>) using the HTTP01 challenge mechanism. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dns01</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Configures cert-manager to attempt to complete authorizations by performing the DNS01 challenge flow.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>Used to configure a DNS01 challenge provider to be used when solving DNS01 challenges. Only one DNS provider may be configured per solver.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>cnameStrategy</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.CNAMEStrategy">CNAMEStrategy</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>akamai</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Akamai DNS zone management API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloudDNS</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Google Cloud DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloudflare</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Cloudflare API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>route53</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the AWS Route53 API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>azureDNS</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the Microsoft Azure DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>digitalocean</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Use the DigitalOcean DNS API to manage DNS01 challenge records.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>acmeDNS</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Use the &lsquo;ACME DNS&rsquo; (<a href="https://github.com/joohoi/acme-dns">https://github.com/joohoi/acme-dns</a>) API to manage DNS01 challenge records. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>rfc2136</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Use RFC2136 (&ldquo;Dynamic Updates in the Domain Name System&rdquo;) (<a href="https://datatracker.ietf.org/doc/rfc2136/">https://datatracker.ietf.org/doc/rfc2136/</a>) to manage DNS01 challenge records. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>webhook</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Configure an external webhook based DNS01 challenge solver to manage DNS01 challenge records.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>ACMEChallengeSolverHTTP01 contains configuration detailing how to solve HTTP01 challenges within a Kubernetes cluster. Typically this is accomplished through creating &lsquo;routes&rsquo; of some description that configure ingress controllers to direct traffic to &lsquo;solver pods&rsquo;, which are responsible for responding to the ACME server&rsquo;s HTTP requests.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>ingress</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress based HTTP01 challenge solver will solve challenges by creating or modifying Ingress resources in order to route requests for &lsquo;/.well-known/acme-challenge/XYZ&rsquo; to &lsquo;challenge solver&rsquo; pods that are provisioned by cert-manager for each Challenge to be completed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01">ACMEChallengeSolverHTTP01</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceType</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#servicetype-v1-core">Kubernetes core/v1.ServiceType</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional service type for Kubernetes solver service</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>class</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The ingress class to use when creating Ingress resources to solve ACME challenges that use this challenge solver. Only one of &lsquo;class&rsquo; or &lsquo;name&rsquo; may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>name</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The name of the ingress resource that should have ACME challenge solving routes inserted into it in order to solve HTTP01 challenges. This is typically used in conjunction with ingress controllers like ingress-gce, which maintains a 1:1 mapping between external IPs and ingress resources.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>podTemplate</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional pod template used to configure the ACME challenge solver pods used for HTTP01 challenges</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ingressTemplate</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Optional ingress template used to configure the ACME challenge solver ingress used for HTTP01 challenges</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressObjectMeta">ACMEChallengeSolverHTTP01IngressObjectMeta</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>annotations</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Annotations that should be added to the created ACME HTTP01 solver ingress.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>labels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Labels that should be added to the created ACME HTTP01 solver ingress.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>annotations</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Annotations that should be added to the create ACME HTTP01 solver pods.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>labels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Labels that should be added to the created ACME HTTP01 solver pods.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nodeSelector</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>affinity</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s scheduling constraints</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tolerations</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s tolerations.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>priorityClassName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s priorityClassName.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>serviceAccountName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If specified, the pod&rsquo;s service account</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressPodTemplate">ACMEChallengeSolverHTTP01IngressPodTemplate</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressPodObjectMeta">ACMEChallengeSolverHTTP01IngressPodObjectMeta</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ObjectMeta overrides for the pod used to solve HTTP01 challenges. Only the &lsquo;labels&rsquo; and &lsquo;annotations&rsquo; fields may be set. If labels or annotations overlap with in-built values, the values here will override the in-built values.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressPodSpec">ACMEChallengeSolverHTTP01IngressPodSpec</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PodSpec defines overrides for the HTTP01 challenge solver pod. Only the &lsquo;priorityClassName&rsquo;, &lsquo;nodeSelector&rsquo;, &lsquo;affinity&rsquo;, &lsquo;serviceAccountName&rsquo; and &lsquo;tolerations&rsquo; fields are supported currently. All other fields will be ignored.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>nodeSelector</code>
              <br />
              <em>map[string]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> NodeSelector is a selector which must be true for the pod to fit on a node. Selector which must match a node&rsquo;s labels for the pod to be scheduled on that node. More info: <a href="https://kubernetes.io/docs/concepts/configuration/assign-pod-node/">https://kubernetes.io/docs/concepts/configuration/assign-pod-node/</a> </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>affinity</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#affinity-v1-core">Kubernetes core/v1.Affinity</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s scheduling constraints</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>tolerations</code>
              <br />
              <em>
                <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#toleration-v1-core">[]Kubernetes core/v1.Toleration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s tolerations.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>priorityClassName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s priorityClassName.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>serviceAccountName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>If specified, the pod&rsquo;s service account</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressTemplate">ACMEChallengeSolverHTTP01IngressTemplate</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01Ingress">ACMEChallengeSolverHTTP01Ingress</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverHTTP01IngressObjectMeta">ACMEChallengeSolverHTTP01IngressObjectMeta</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ObjectMeta overrides for the ingress used to solve HTTP01 challenges. Only the &lsquo;labels&rsquo; and &lsquo;annotations&rsquo; fields may be set. If labels or annotations overlap with in-built values, the values here will override the in-built values.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEChallengeType"> ACMEChallengeType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ChallengeSpec">ChallengeSpec</a>) </p>
<div>
  <p>The type of ACME challenge. Only HTTP-01 and DNS-01 are supported.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;DNS-01&#34;</p>
      </td>
      <td>
        <p> ACMEChallengeTypeDNS01 denotes a Challenge is of type dns-01 More info: <a href="https://letsencrypt.org/docs/challenge-types/#dns-01-challenge">https://letsencrypt.org/docs/challenge-types/#dns-01-challenge</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;HTTP-01&#34;</p>
      </td>
      <td>
        <p> ACMEChallengeTypeHTTP01 denotes a Challenge is of type http-01 More info: <a href="https://letsencrypt.org/docs/challenge-types/#http-01-challenge">https://letsencrypt.org/docs/challenge-types/#http-01-challenge</a> </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEExternalAccountBinding">ACMEExternalAccountBinding</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEIssuer">ACMEIssuer</a>) </p>
<div>
  <p>ACMEExternalAccountBinding is a reference to a CA external account of the ACME server.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>keyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>keyID is the ID of the CA key that the External Account is bound to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> keySecretRef is a Secret Key Selector referencing a data item in a Kubernetes Secret which holds the symmetric MAC key of the External Account Binding. The <code>key</code> is the index string that is paired with the key data in the Secret and should not be confused with the key data itself, or indeed with the External Account Binding keyID above. The secret key stored in the Secret <strong>must</strong> be un-padded, base64 URL encoded data. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyAlgorithm</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.HMACKeyAlgorithm">HMACKeyAlgorithm</a>
        </em>
      </td>
      <td>
        <p>keyAlgorithm is the MAC key algorithm that the key is used for. Valid values are &ldquo;HS256&rdquo;, &ldquo;HS384&rdquo; and &ldquo;HS512&rdquo;.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEIssuer">ACMEIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>ACMEIssuer contains the specification for an ACME issuer. This uses the RFC8555 specification to obtain certificates by completing &lsquo;challenges&rsquo; to prove ownership of domain identifiers. Earlier draft versions of the ACME specification are not supported.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Email is the email address to be associated with the ACME account. This field is optional, but it is strongly recommended to be set. It will be used to contact you in case of issues with your account or certificates, including expiry notification emails. This field may be updated after the account is initially registered.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Server is the URL used to access the ACME server&rsquo;s &lsquo;directory&rsquo; endpoint. For example, for Let&rsquo;s Encrypt&rsquo;s staging endpoint, you would use: &ldquo;<a href='https://acme-staging-v02.api.letsencrypt.org/directory"'>https://acme-staging-v02.api.letsencrypt.org/directory&rdquo;</a>. Only ACME v2 endpoints (i.e. RFC 8555) are supported. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>preferredChain</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PreferredChain is the chain to use if the ACME server outputs multiple. PreferredChain is no guarantee that this one gets delivered by the ACME endpoint. For example, for Let&rsquo;s Encrypt&rsquo;s DST crosssign you would use: &ldquo;DST Root CA X3&rdquo; or &ldquo;ISRG Root X1&rdquo; for the newer Let&rsquo;s Encrypt root CA. This value picks the first certificate bundle in the ACME alternative chains that has a certificate with this value as its issuer&rsquo;s CN</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>skipTLSVerify</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Enables or disables validation of the ACME server TLS certificate. If true, requests to the ACME server will not have their TLS certificate validated (i.e. insecure connections will be allowed). Only enable this option in development environments. The cert-manager system installed roots will be used to verify connections to the ACME server if this is false. Defaults to false.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>externalAccountBinding</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ExternalAccountBinding is a reference to a CA external account of the ACME server. If set, upon registration cert-manager will attempt to associate the given external account credentials with the registered ACME account.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>privateKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> PrivateKey is the name of a Kubernetes Secret resource that will be used to store the automatically generated ACME account private key. Optionally, a <code>key</code> may be specified to select a specific entry within the named Secret resource. If <code>key</code> is not specified, a default of <code>tls.key</code> will be used. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solvers</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolver">[]ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Solvers is a list of challenge solvers that will be used to solve ACME challenges for the matching domains. Solver configurations must be provided in order to obtain certificates from an ACME server. For more information, see: <a href="https://cert-manager.io/docs/configuration/acme/">https://cert-manager.io/docs/configuration/acme/</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>disableAccountKeyGeneration</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Enables or disables generating a new ACME account key. If true, the Issuer resource will <em>not</em> request a new account but will expect the account key to be supplied via an existing secret. If false, the cert-manager system will generate a new ACME account key for the Issuer. Defaults to false. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>enableDurationFeature</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Enables requesting a Not After date on certificates that matches the duration of the certificate. This is not supported by all ACME servers like Let&rsquo;s Encrypt. If set to true when the ACME server does not support it it will create an error on the Order. Defaults to false.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAcmeDNS is a structure containing the configuration for ACME-DNS servers</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>host</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAkamai is a structure containing the DNS configuration for Akamai DNS—Zone Record Management API</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceConsumerDomain</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>accessTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderAzureDNS is a structure containing the configuration for Azure DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>clientID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>if both this and ClientSecret are left unset MSI will be used</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>clientSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>if both this and ClientID are left unset MSI will be used</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>subscriptionID</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>tenantID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>when specifying ClientID and ClientSecret then this field is also needed</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>resourceGroupName</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>environment</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.AzureDNSEnvironment">AzureDNSEnvironment</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderCloudDNS is a structure containing the DNS configuration for Google Cloud DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>serviceAccountSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
      </td>
    </tr>
    <tr>
      <td>
        <code>project</code>
        <br />
        <em>string</em>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>HostedZoneName is an optional field that tells cert-manager in which Cloud DNS zone the challenge record has to be created. If left empty cert-manager will automatically choose a zone.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p> ACMEIssuerDNS01ProviderCloudflare is a structure containing the DNS configuration for Cloudflare. One of <code>apiKeySecretRef</code> or <code>apiTokenSecretRef</code> must be provided. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>email</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Email of the account, only required when using API key based authentication.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>API key to use to authenticate with Cloudflare. Note: using an API token to authenticate is now the recommended method as it allows greater control of permissions.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>API token used to authenticate with Cloudflare.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderDigitalOcean is a structure containing the DNS configuration for DigitalOcean Domains</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRFC2136 is a structure containing the configuration for RFC2136 DNS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>nameserver</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The IP address or hostname of an authoritative DNS server supporting RFC2136 in the form host:port. If the host is an IPv6 address it must be enclosed in square brackets (e.g [2001:db8::1]) ; port is optional. This field is required.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigSecretSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The name of the secret containing the TSIG value. If <code>tsigKeyName</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigKeyName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Key name configured in the DNS. If <code>tsigSecretSecretRef</code> is defined, this field is required. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tsigAlgorithm</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The TSIG Algorithm configured in the DNS supporting RFC2136. Used only when <code>tsigSecretSecretRef</code> and <code>tsigKeyName</code> are defined. Supported values are (case-insensitive): <code>HMACMD5</code> (default), <code>HMACSHA1</code>, <code>HMACSHA256</code> or <code>HMACSHA512</code>. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderRoute53 is a structure containing the Route 53 configuration for AWS</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>accessKeyID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The AccessKeyID is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata see: <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretAccessKeySecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The SecretAccessKey is used for authentication. If not set we fall-back to using env vars, shared credentials file or AWS Instance metadata
          <a href="https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials">https://docs.aws.amazon.com/sdk-for-go/v1/developer-guide/configuring-sdk.html#specifying-credentials</a>
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Role is a Role ARN which the Route53 provider will assume using either the explicit credentials AccessKeyID/SecretAccessKey or the inferred credentials from environment variables, shared credentials file or AWS Instance metadata</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>hostedZoneID</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>If set, the provider will manage only this zone in Route53 and will not do an lookup using the route53:ListHostedZonesByName api call.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>region</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Always set the region when using AccessKeyID and SecretAccessKey</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderWebhook">ACMEIssuerDNS01ProviderWebhook</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>ACMEIssuerDNS01ProviderWebhook specifies configuration for a webhook DNS01 provider, including where to POST ChallengePayload resources.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>groupName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The API group name that should be used when POSTing ChallengePayload resources to the webhook apiserver. This should be the same as the GroupName specified in the webhook provider implementation.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solverName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The name of the solver to use, as defined in the webhook provider implementation. This will typically be the name of the provider, e.g. &lsquo;cloudflare&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>config</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#json-v1beta1-apiextensions">Kubernetes apiextensions/v1beta1.JSON</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Additional configuration that should be passed to the webhook apiserver when challenges are processed. This can contain arbitrary JSON data. Secret values should not be specified in this stanza. If secret values are needed (e.g. credentials for a DNS service), you should use a SecretKeySelector to reference a Secret resource. For details on the schema of this field, consult the webhook provider implementation&rsquo;s documentation.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ACMEIssuerStatus">ACMEIssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.IssuerStatus">IssuerStatus</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>uri</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URI is the unique account identifier, which can also be used to retrieve account details from the CA</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastRegisteredEmail</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastRegisteredEmail is the email associated with the latest registered ACME account, in order to track changes made to registered account associated with the Issuer</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.AzureDNSEnvironment"> AzureDNSEnvironment (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;AzureChinaCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureGermanCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzurePublicCloud&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;AzureUSGovernmentCloud&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.CNAMEStrategy"> CNAMEStrategy (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolverDNS01">ACMEChallengeSolverDNS01</a>) </p>
<div>
  <p>CNAMEStrategy configures how the DNS01 provider should handle CNAME records when found in DNS zones. By default, the None strategy will be applied (i.e. do not follow CNAMEs).</p>
</div>
<h3 id="acme.cert-manager.io/v1beta1.CertificateDNSNameSelector">CertificateDNSNameSelector</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolver">ACMEChallengeSolver</a>) </p>
<div>
  <p>CertificateDomainSelector selects certificates using a label selector, and can optionally select individual DNS names within those certificates. If both MatchLabels and DNSNames are empty, this selector will match all certificates and DNS names within them.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>matchLabels</code>
        <br />
        <em>map[string]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>A label selector that is used to refine the set of certificate&rsquo;s that this challenge solver will apply to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSNames that this solver will be used to solve. If specified and a match is found, a dnsNames selector will take precedence over a dnsZones selector. If multiple solvers match with the same dnsNames value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsZones</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>List of DNSZones that this solver will be used to solve. The most specific DNS zone match specified here will take precedence over other DNS zone matches, so a solver specifying sys.example.com will be selected over one specifying example.com for the domain www.sys.example.com. If multiple solvers match with the same dnsZones value, the solver with the most matching labels in matchLabels will be selected. If neither has more matches, the solver defined earlier in the list will be selected.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ChallengeSpec">ChallengeSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The URL of the ACME Challenge resource for this challenge. This can be used to lookup details about the status of this challenge.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>authorizationURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The URL to the ACME Authorization resource that this challenge is a part of.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> dnsName is the identifier that this challenge is for, e.g. example.com. If the requested DNSName is a &lsquo;wildcard&rsquo;, this field MUST be set to the non-wildcard domain, e.g. for <code>*.example.com</code>, it must be <code>example.com</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>wildcard</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>wildcard will be true if this challenge is for a wildcard identifier, for example &lsquo;*.example.com&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeType">ACMEChallengeType</a>
        </em>
      </td>
      <td>
        <p>The type of ACME challenge this resource represents. One of &ldquo;HTTP-01&rdquo; or &ldquo;DNS-01&rdquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>token</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>The ACME challenge token for this challenge. This is the raw value returned from the ACME server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>key</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>
          The ACME challenge key for this challenge For HTTP01 challenges, this is the value that must be responded with to complete the HTTP01 challenge in the format:
          <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>. For DNS01 challenges, this is the base64 encoded SHA256 sum of the
          <code>&lt;private key JWK thumbprint&gt;.&lt;key from acme server for challenge&gt;</code>
          text that must be set as the TXT record content.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>solver</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEChallengeSolver">ACMEChallengeSolver</a>
        </em>
      </td>
      <td>
        <p>Contains the domain solving configuration that should be used to solve this challenge resource.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>References a properly configured ACME-type Issuer which should be used to create this Challenge. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Challenge will be marked as failed.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.ChallengeStatus">ChallengeStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.Challenge">Challenge</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>processing</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Used to denote whether this challenge should be processed or not. This field will only be set to true by the &lsquo;scheduling&rsquo; component. It will only be set to false by the &lsquo;challenges&rsquo; controller, after the challenge has reached a final state or timed out. If this field is set to false, the challenge controller will not take any more action.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>presented</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> presented will be set to true if the challenge values for this challenge are currently &lsquo;presented&rsquo;. This <em>does not</em> imply the self check is passing. Only that the values have been &lsquo;submitted&rsquo; for the appropriate challenge mechanism (i.e. the DNS01 TXT record has been presented, or the HTTP01 configuration has been configured). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Contains human readable information on why the Challenge is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Contains the current &lsquo;state&rsquo; of the challenge. If not set, the state of the challenge is unknown.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.HMACKeyAlgorithm"> HMACKeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>) </p>
<div>
  <p>HMACKeyAlgorithm is the name of a key algorithm used for HMAC encryption</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;HS256&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS384&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;HS512&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.OrderSpec">OrderSpec</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>request</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>Certificate signing request bytes in DER encoding. This will be used when finalizing the order. This field must be set on the order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p>IssuerRef references a properly configured ACME-type Issuer which should be used to create this Order. If the Issuer does not exist, processing will be retried. If the Issuer is not an &lsquo;ACME&rsquo; Issuer, an error will be returned and the Order will be marked as failed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> CommonName is the common name as specified on the DER encoded CSR. If specified, this value must also be present in <code>dnsNames</code> or <code>ipAddresses</code>. This field must match the corresponding field on the DER encoded CSR. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of DNS names that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ipAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IPAddresses is a list of IP addresses that should be included as part of the Order validation process. This field must match the corresponding field on the DER encoded CSR.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Duration is the duration for the not after date for the requested certificate. this is set on order creation as pe the ACME spec.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.OrderStatus">OrderStatus</h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.Order">Order</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URL of the Order. This will initially be empty when the resource is first created. The Order controller will populate this field when the Order is first processed. This field will be immutable after it is initially set.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>finalizeURL</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FinalizeURL of the Order. This is used to obtain certificates for this order once it has been completed.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>authorizations</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEAuthorization">[]ACMEAuthorization</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Authorizations contains data returned from the ACME server on what authorizations must be completed in order to validate the DNS names specified on the Order.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Certificate is a copy of the PEM encoded certificate for this Order. This field will be populated after the order has been successfully finalized with the ACME server, and the order has transitioned to the &lsquo;valid&rsquo; state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>state</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.State">State</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State contains the current state of this Order resource. States &lsquo;success&rsquo; and &lsquo;expired&rsquo; are &lsquo;final&rsquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason optionally provides more information about a why the order is in the current state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this order failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="acme.cert-manager.io/v1beta1.State"> State (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1beta1.ACMEAuthorization">ACMEAuthorization</a>, <a href="#acme.cert-manager.io/v1beta1.ChallengeStatus">ChallengeStatus</a>, <a href="#acme.cert-manager.io/v1beta1.OrderStatus">OrderStatus</a>) </p>
<div>
  <p>
    State represents the state of an ACME resource, such as an Order. The possible options here map to the corresponding values in the ACME specification. Full details of these values can be found here: <a href="https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6">https://tools.ietf.org/html/draft-ietf-acme-acme-15#section-7.1.6</a>
    Clients utilising this type must also gracefully handle unknown values, as the contents of this enumeration may be added to over time.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;errored&#34;</p>
      </td>
      <td>
        <p>Errored signifies that the ACME resource has errored for some reason. This is a catch-all state, and is used for marking internal cert-manager errors such as validation failures. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;expired&#34;</p>
      </td>
      <td>
        <p>Expired signifies that an ACME resource has expired. If an Order is marked &lsquo;Expired&rsquo;, one of its validations may have expired or the Order itself. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;invalid&#34;</p>
      </td>
      <td>
        <p>Invalid signifies that an ACME resource is invalid for some reason. If an Order is marked &lsquo;invalid&rsquo;, one of its validations be have invalid for some reason. This is a final state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;pending&#34;</p>
      </td>
      <td>
        <p>Pending signifies that an ACME resource is still pending and is not yet ready. If an Order is marked &lsquo;Pending&rsquo;, the validations for that Order are still in progress. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;processing&#34;</p>
      </td>
      <td>
        <p>Processing signifies that an ACME resource is being processed by the server. If an Order is marked &lsquo;Processing&rsquo;, the validations for that Order are currently being processed. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;ready&#34;</p>
      </td>
      <td>
        <p>Ready signifies that an ACME resource is in a ready state. If an order is &lsquo;ready&rsquo;, all of its challenges have been completed successfully and the order is ready to be finalized. Once finalized, it will transition to the Valid state. This is a transient state.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;&#34;</p>
      </td>
      <td>
        <p>Unknown is not a real state as part of the ACME spec. It is used to represent an unrecognised value.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;valid&#34;</p>
      </td>
      <td>
        <p>Valid signifies that an ACME resource is in a valid state. If an order is &lsquo;valid&rsquo;, it has been finalized with the ACME server and the certificate can be retrieved from the ACME server using the certificate URL stored in the Order&rsquo;s status subresource. This is a final state.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="cert-manager.io/v1">cert-manager.io/v1</h2>
<div>
  <p>Package v1 is the v1 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#cert-manager.io/v1.Certificate">Certificate</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1.CertificateRequest">CertificateRequest</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1.ClusterIssuer">ClusterIssuer</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1.Issuer">Issuer</a>
  </li>
</ul>
<h3 id="cert-manager.io/v1.Certificate">Certificate</h3>
<div>
  <p> A Certificate resource should be created to ensure an up to date and signed x509 certificate is stored in the Kubernetes Secret resource named in <code>spec.secretName</code>. </p>
  <p> The stored certificate will be renewed before it expires (as configured by <code>spec.renewBefore</code>). </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Certificate</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.CertificateSpec">CertificateSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the Certificate resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>subject</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1.X509Subject">X509Subject</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs. This value is ignored by TLS clients when any subject alt name is set. This is x509 behaviour: <a href="https://tools.ietf.org/html/rfc6125#section-6.4.4">https://tools.ietf.org/html/rfc6125#section-6.4.4</a> </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types. If overridden and <code>renewBefore</code> is greater than the actual certificate duration, the certificate will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>renewBefore</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>
                The amount of time before the currently issued certificate&rsquo;s <code>notAfter</code>
                time that cert-manager will begin to attempt to renew the certificate. If this value is greater than the total duration of the certificate (i.e. notAfter - notBefore), it will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of DNS subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>ipAddresses</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IPAddresses is a list of IP address subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>uris</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>URIs is a list of URI subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>emailAddresses</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>EmailAddresses is a list of email subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>secretName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>SecretName is the name of the secret resource that will be automatically created and managed by this Certificate resource. It will be populated with a private key and certificate, signed by the denoted issuer.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keystores</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1.CertificateKeystores">CertificateKeystores</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>
                Keystores configures additional keystore output formats stored in the
                <code>secretName</code> Secret resource.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p> IssuerRef is a reference to the issuer for this certificate. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> IsCA will mark this Certificate as valid for certificate signing. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>privateKey</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1.CertificatePrivateKey">CertificatePrivateKey</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Options to control private keys used for the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>encodeUsagesInRequest</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>EncodeUsagesInRequest controls whether key usages should be present in the CertificateRequest</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.CertificateStatus">CertificateStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Status of the Certificate. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CertificateRequest">CertificateRequest</h3>
<div>
  <p>A CertificateRequest is used to request a signed certificate from one of the configured issuers.</p>
  <p>
    All fields within the CertificateRequest&rsquo;s <code>spec</code> are immutable after creation. A CertificateRequest will either succeed or fail, as denoted by its <code>status.state</code>
    field.
  </p>
  <p>A CertificateRequest is a one-shot resource, meaning it represents a single point in time request for a certificate and cannot be re-used.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>CertificateRequest</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.CertificateRequestSpec">CertificateRequestSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the CertificateRequest resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p> IssuerRef is a reference to the issuer for this CertificateRequest. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to <code>cert-manager.io</code> if empty. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>request</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>The PEM-encoded x509 certificate signing request to be submitted to the CA for signing.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> IsCA will request to mark the certificate as valid for certificate signing when submitting to the issuer. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Usages is the set of x509 usages that are requested for the certificate. If usages are set they SHOULD be encoded inside the CSR spec Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.CertificateRequestStatus">CertificateRequestStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Status of the CertificateRequest. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.ClusterIssuer">ClusterIssuer</h3>
<div>
  <p> A ClusterIssuer represents a certificate issuing authority which can be referenced as part of <code>issuerRef</code> fields. It is similar to an Issuer, however it is cluster-scoped and therefore can be referenced by resources that exist in <em>any</em> namespace, not just the same namespace as the referent. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>ClusterIssuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the ClusterIssuer resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Status of the ClusterIssuer. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.Issuer">Issuer</h3>
<div>
  <p> An Issuer represents a certificate issuing authority which can be referenced as part of <code>issuerRef</code> fields. It is scoped to a single namespace and can therefore only be referenced by resources within the same namespace. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Issuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the Issuer resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Status of the Issuer. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CAIssuer">CAIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.IssuerConfig">IssuerConfig</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret used to sign Certificates issued by this Issuer.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>crlDistributionPoints</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The CRL distribution points is an X.509 v3 certificate extension which identifies the location of the CRL from which the revocation of this certificate can be checked. If not set, certificates will be issued without distribution points set.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ocspServers</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The OCSP server list is an X.509 v3 extension that defines a list of URLs of OCSP responders. The OCSP responders can be queried for the revocation status of an issued certificate. If not set, the certificate wil be issued with no OCSP servers set. For example, an OCSP server URL could be &ldquo;<a href='http://ocsp.int-x3.letsencrypt.org"'>http://ocsp.int-x3.letsencrypt.org&rdquo;</a>. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CertificateCondition">CertificateCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateStatus">CertificateStatus</a>) </p>
<div>
  <p>CertificateCondition contains condition information for an Certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.CertificateConditionType">CertificateConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>, <code>Issuing</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CertificateConditionType"> CertificateConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateCondition">CertificateCondition</a>) </p>
<div>
  <p>CertificateConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Issuing&#34;</p>
      </td>
      <td>
        <p>
          A condition added to Certificate resources when an issuance is required. This condition will be automatically added and set to true if: * No keypair data exists in the target Secret * The data stored in the Secret cannot be decoded * The private key and certificate do not have matching public keys * If a CertificateRequest for the current revision exists and the certificate data stored in the Secret does not match the
          <code>status.certificate</code> on the CertificateRequest. * If no CertificateRequest resource exists for the current revision, the options on the Certificate resource are compared against the x509 data in the Secret, similar to what&rsquo;s done in earlier versions. If there is a mismatch, an issuance is triggered. This condition may also be added by external API consumers to trigger a re-issuance manually for any other reason.
        </p>
        <p>It will be removed by the &lsquo;issuing&rsquo; controller upon completing issuance.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateConditionReady indicates that a certificate is ready for use. This is defined as: - The target secret exists - The target secret contains a certificate that has not expired - The target secret contains a private key valid for the certificate - The commonName and dnsNames attributes match those specified on the Certificate</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CertificateKeystores">CertificateKeystores</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>CertificateKeystores configures additional keystore output formats to be created in the Certificate&rsquo;s output Secret.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>jks</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.JKSKeystore">JKSKeystore</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          JKS configures options for storing a JKS keystore in the
          <code>spec.secretName</code> Secret resource.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>pkcs12</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.PKCS12Keystore">PKCS12Keystore</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          PKCS12 configures options for storing a PKCS12 keystore in the
          <code>spec.secretName</code> Secret resource.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CertificatePrivateKey">CertificatePrivateKey</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>CertificatePrivateKey contains configuration options for private keys used by the Certificate controller. This allows control of how private keys are rotated.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>rotationPolicy</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.PrivateKeyRotationPolicy">PrivateKeyRotationPolicy</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> RotationPolicy controls how private keys should be regenerated when a re-issuance is being processed. If set to Never, a private key will only be generated if one does not already exist in the target <code>spec.secretName</code>. If one does exists but it does not have the correct algorithm or size, a warning will be raised to await user intervention. If set to Always, a private key matching the specified requirements will be generated whenever a re-issuance occurs. Default is &lsquo;Never&rsquo; for backward compatibility. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>encoding</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.PrivateKeyEncoding">PrivateKeyEncoding</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The private key cryptography standards (PKCS) encoding for this certificate&rsquo;s private key to be encoded in. If provided, allowed values are <code>PKCS1</code> and <code>PKCS8</code> standing for PKCS#1 and PKCS#8, respectively. Defaults to <code>PKCS1</code> if not specified. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>algorithm</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.PrivateKeyAlgorithm">PrivateKeyAlgorithm</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Algorithm is the private key algorithm of the corresponding private key for this certificate. If provided, allowed values are either <code>RSA</code> or <code>ECDSA</code> If <code>algorithm</code> is specified and <code>size</code> is not provided, key size of 256 will be used for <code>ECDSA</code> key algorithm and key size of 2048 will be used for <code>RSA</code> key algorithm. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>size</code>
        <br />
        <em>int</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Size is the key bit size of the corresponding private key for this certificate. If <code>algorithm</code> is set to <code>RSA</code>, valid values are <code>2048</code>, <code>4096</code> or <code>8192</code>, and will default to <code>2048</code> if not specified. If <code>algorithm</code> is set to <code>ECDSA</code>, valid values are <code>256</code>, <code>384</code> or <code>521</code>, and will default to <code>256</code> if not specified. No other values are allowed. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CertificateRequestCondition">CertificateRequestCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateRequestStatus">CertificateRequestStatus</a>) </p>
<div>
  <p>CertificateRequestCondition contains condition information for a CertificateRequest.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.CertificateRequestConditionType">CertificateRequestConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>, <code>InvalidRequest</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CertificateRequestConditionType"> CertificateRequestConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateRequestCondition">CertificateRequestCondition</a>) </p>
<div>
  <p>CertificateRequestConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;InvalidRequest&#34;</p>
      </td>
      <td>
        <p> CertificateRequestConditionInvalidRequest indicates that a certificate signer has refused to sign the request due to at least one of the input parameters being invalid. Additional information about why the request was rejected can be found in the <code>reason</code> and <code>message</code> fields. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateRequestConditionReady indicates that a certificate is ready for use. This is defined as: - The target certificate exists in CertificateRequest.Status</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CertificateRequestSpec">CertificateRequestSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateRequestSpec defines the desired state of CertificateRequest</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p> IssuerRef is a reference to the issuer for this CertificateRequest. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to <code>cert-manager.io</code> if empty. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>request</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>The PEM-encoded x509 certificate signing request to be submitted to the CA for signing.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> IsCA will request to mark the certificate as valid for certificate signing when submitting to the issuer. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Usages is the set of x509 usages that are requested for the certificate. If usages are set they SHOULD be encoded inside the CSR spec Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CertificateRequestStatus">CertificateRequestStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateRequestStatus defines the observed state of CertificateRequest and resulting signed certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.CertificateRequestCondition">[]CertificateRequestCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of a CertificateRequest. Known condition types are <code>Ready</code> and <code>InvalidRequest</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The PEM encoded x509 certificate resulting from the certificate signing request. If not set, the CertificateRequest has either not been completed or has failed. More information on failure can be found by checking the
          <code>conditions</code> field.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The PEM encoded x509 certificate of the signer, also known as the CA (Certificate Authority). This is set on a best-effort basis by different issuers. If not set, the CA is assumed to be unknown/not available.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this CertificateRequest failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CertificateSpec">CertificateSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateSpec defines the desired state of Certificate. A valid Certificate requires at least one of a CommonName, DNSName, or URISAN to be valid.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>subject</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.X509Subject">X509Subject</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs. This value is ignored by TLS clients when any subject alt name is set. This is x509 behaviour: <a href="https://tools.ietf.org/html/rfc6125#section-6.4.4">https://tools.ietf.org/html/rfc6125#section-6.4.4</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types. If overridden and <code>renewBefore</code> is greater than the actual certificate duration, the certificate will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>renewBefore</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The amount of time before the currently issued certificate&rsquo;s <code>notAfter</code>
          time that cert-manager will begin to attempt to renew the certificate. If this value is greater than the total duration of the certificate (i.e. notAfter - notBefore), it will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of DNS subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ipAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IPAddresses is a list of IP address subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>uris</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URIs is a list of URI subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>emailAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>EmailAddresses is a list of email subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret resource that will be automatically created and managed by this Certificate resource. It will be populated with a private key and certificate, signed by the denoted issuer.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keystores</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.CertificateKeystores">CertificateKeystores</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          Keystores configures additional keystore output formats stored in the
          <code>secretName</code> Secret resource.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p> IssuerRef is a reference to the issuer for this certificate. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> IsCA will mark this Certificate as valid for certificate signing. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>privateKey</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.CertificatePrivateKey">CertificatePrivateKey</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Options to control private keys used for the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>encodeUsagesInRequest</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>EncodeUsagesInRequest controls whether key usages should be present in the CertificateRequest</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.CertificateStatus">CertificateStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateStatus defines the observed state of Certificate</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.CertificateCondition">[]CertificateCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of certificates. Known condition types are <code>Ready</code> and <code>Issuing</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastFailureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastFailureTime is the time as recorded by the Certificate controller of the most recent failure to complete a CertificateRequest for this Certificate resource. If set, cert-manager will not re-request another Certificate until 1 hour has elapsed from this time.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>notBefore</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The time after which the certificate stored in the secret named by this resource in spec.secretName is valid.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>notAfter</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The expiration time of the certificate stored in the secret named by this resource in <code>spec.secretName</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>renewalTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>RenewalTime is the time at which the certificate will be next renewed. If not set, no upcoming renewal is scheduled.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>revision</code>
        <br />
        <em>int</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The current &lsquo;revision&rsquo; of the certificate as issued.</p>
        <p>
          When a CertificateRequest resource is created, it will have the
          <code>cert-manager.io/certificate-revision</code> set to one greater than the current value of this field.
        </p>
        <p>Upon issuance, this field will be set to the value of the annotation on the CertificateRequest resource used to issue the certificate.</p>
        <p>Persisting the value on the CertificateRequest resource allows the certificates controller to know whether a request is part of an old issuance or if it is part of the ongoing revision&rsquo;s issuance by checking if the revision value in the annotation is greater than this field.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>nextPrivateKeySecretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The name of the Secret resource containing the private key to be used for the next certificate iteration. The keymanager controller will automatically set this field if the
          <code>Issuing</code> condition is set to <code>True</code>. It will automatically unset this field when the Issuing condition is not set or False.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.GenericIssuer">GenericIssuer</h3>
<div></div>
<h3 id="cert-manager.io/v1.IssuerCondition">IssuerCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.IssuerStatus">IssuerStatus</a>) </p>
<div>
  <p>IssuerCondition contains condition information for an Issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.IssuerConditionType">IssuerConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.IssuerConditionType"> IssuerConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.IssuerCondition">IssuerCondition</a>) </p>
<div>
  <p>IssuerConditionType represents an Issuer condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p> IssuerConditionReady represents the fact that a given Issuer condition is in ready state and able to issue certificates. If the <code>status</code> of this condition is <code>False</code>, CertificateRequest controllers should prevent attempts to sign certificates. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.IssuerConfig">IssuerConfig</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.IssuerSpec">IssuerSpec</a>) </p>
<div>
  <p>The configuration for the issuer. Only one of these can be set.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEIssuer">ACMEIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ACME configures this issuer to communicate with a RFC8555 (ACME) server to obtain signed x509 certificates.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.CAIssuer">CAIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CA configures this issuer to sign certificates using a signing CA keypair stored in a Secret resource. This is used to build internal PKIs that are managed by cert-manager.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>vault</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.VaultIssuer">VaultIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Vault configures this issuer to sign certificates using a HashiCorp Vault PKI backend.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>selfSigned</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.SelfSignedIssuer">SelfSignedIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>SelfSigned configures this issuer to &lsquo;self sign&rsquo; certificates using the private key used to create the CertificateRequest object.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>venafi</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.VenafiIssuer">VenafiIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Venafi configures this issuer to sign certificates using a Venafi TPP or Venafi Cloud policy zone.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.IssuerSpec">IssuerSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerSpec is the specification of an Issuer. This includes any configuration required for the issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>IssuerConfig</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.IssuerConfig">IssuerConfig</a>
        </em>
      </td>
      <td>
        <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.IssuerStatus">IssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerStatus contains status information about an Issuer</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.IssuerCondition">[]IssuerCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of a CertificateRequest. Known condition types are <code>Ready</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1.ACMEIssuerStatus">ACMEIssuerStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ACME specific status options. This field should only be set if the Issuer is configured to use an ACME server to issue certificates.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.JKSKeystore">JKSKeystore</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateKeystores">CertificateKeystores</a>) </p>
<div>
  <p>
    JKS configures options for storing a JKS keystore in the <code>spec.secretName</code>
    Secret resource.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>create</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <p> Create enables JKS keystore creation for the Certificate. If true, a file named <code>keystore.jks</code> will be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code>. The keystore file will only be updated upon re-issuance. A file named <code>truststore.jks</code> will also be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code> containing the issuing Certificate Authority </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>passwordSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>PasswordSecretRef is a reference to a key in a Secret resource containing the password used to encrypt the JKS keystore.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.KeyUsage"> KeyUsage (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateRequestSpec">CertificateRequestSpec</a>, <a href="#cert-manager.io/v1.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>
    KeyUsage specifies valid usage contexts for keys. See: <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.3">https://tools.ietf.org/html/rfc5280#section-4.2.1.3</a>
    <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.12">https://tools.ietf.org/html/rfc5280#section-4.2.1.12</a>
    Valid KeyUsage values are as follows: &ldquo;signing&rdquo;, &ldquo;digital signature&rdquo;, &ldquo;content commitment&rdquo;, &ldquo;key encipherment&rdquo;, &ldquo;key agreement&rdquo;, &ldquo;data encipherment&rdquo;, &ldquo;cert sign&rdquo;, &ldquo;crl sign&rdquo;, &ldquo;encipher only&rdquo;, &ldquo;decipher only&rdquo;, &ldquo;any&rdquo;, &ldquo;server auth&rdquo;, &ldquo;client auth&rdquo;, &ldquo;code signing&rdquo;, &ldquo;email protection&rdquo;, &ldquo;s/mime&rdquo;, &ldquo;ipsec end system&rdquo;, &ldquo;ipsec tunnel&rdquo;, &ldquo;ipsec user&rdquo;, &ldquo;timestamping&rdquo;, &ldquo;ocsp signing&rdquo;, &ldquo;microsoft sgc&rdquo;, &ldquo;netscape sgc&rdquo;
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;any&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;crl sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;cert sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;client auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;code signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;content commitment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;data encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;decipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;digital signature&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;email protection&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;encipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec end system&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec tunnel&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec user&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key agreement&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;microsoft sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;netscape sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ocsp signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;s/mime&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;server auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;timestamping&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.PKCS12Keystore">PKCS12Keystore</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateKeystores">CertificateKeystores</a>) </p>
<div>
  <p>
    PKCS12 configures options for storing a PKCS12 keystore in the
    <code>spec.secretName</code> Secret resource.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>create</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <p> Create enables PKCS12 keystore creation for the Certificate. If true, a file named <code>keystore.p12</code> will be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code>. The keystore file will only be updated upon re-issuance. A file named <code>truststore.p12</code> will also be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code> containing the issuing Certificate Authority </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>passwordSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>PasswordSecretRef is a reference to a key in a Secret resource containing the password used to encrypt the PKCS12 keystore.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.PrivateKeyAlgorithm"> PrivateKeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificatePrivateKey">CertificatePrivateKey</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;ECDSA&#34;</p>
      </td>
      <td>
        <p>Denotes the ECDSA private key type.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;RSA&#34;</p>
      </td>
      <td>
        <p>Denotes the RSA private key type.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.PrivateKeyEncoding"> PrivateKeyEncoding (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificatePrivateKey">CertificatePrivateKey</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;PKCS1&#34;</p>
      </td>
      <td>
        <p> PKCS1 key encoding will produce PEM files that include the type of private key as part of the PEM header, e.g. <code>BEGIN RSA PRIVATE KEY</code>. If the keyAlgorithm is set to &lsquo;ECDSA&rsquo;, this will produce private keys that use the <code>BEGIN EC PRIVATE KEY</code> header. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;PKCS8&#34;</p>
      </td>
      <td>
        <p>
          PKCS8 key encoding will produce PEM files with the <code>BEGIN PRIVATE KEY</code>
          header. It encodes the keyAlgorithm of the private key as part of the DER encoded PEM block.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.PrivateKeyRotationPolicy"> PrivateKeyRotationPolicy (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificatePrivateKey">CertificatePrivateKey</a>) </p>
<div>
  <p>Denotes how private keys should be generated or sourced when a Certificate is being issued.</p>
</div>
<h3 id="cert-manager.io/v1.SelfSignedIssuer">SelfSignedIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to &lsquo;self sign&rsquo; certificates using the private key used to create the CertificateRequest object.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>crlDistributionPoints</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The CRL distribution points is an X.509 v3 certificate extension which identifies the location of the CRL from which the revocation of this certificate can be checked. If not set certificate will be issued without CDP. Values are strings.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.VaultAppRole">VaultAppRole</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.VaultAuth">VaultAuth</a>) </p>
<div>
  <p>VaultAppRole authenticates with Vault using the App Role auth mechanism, with the role and secret stored in a Kubernetes Secret resource.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Path where the App Role authentication backend is mounted in Vault, e.g: &ldquo;approle&rdquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>roleId</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>RoleID configured in the App Role authentication backend when setting up the authentication backend in Vault.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> Reference to a key in a Secret that contains the App Role secret used to authenticate with Vault. The <code>key</code> field must be specified and denotes which entry within the Secret resource is used as the app role secret. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.VaultAuth">VaultAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.VaultIssuer">VaultIssuer</a>) </p>
<div>
  <p> Configuration used to authenticate with a Vault server. Only one of <code>tokenSecretRef</code>, <code>appRole</code> or <code>kubernetes</code> may be specified. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>TokenSecretRef authenticates with Vault by presenting a token.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>appRole</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.VaultAppRole">VaultAppRole</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>AppRole authenticates with Vault using the App Role auth mechanism, with the role and secret stored in a Kubernetes Secret resource.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>kubernetes</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.VaultKubernetesAuth">VaultKubernetesAuth</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Kubernetes authenticates with Vault by passing the ServiceAccount token stored in the named Secret resource to the Vault server.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.VaultIssuer">VaultIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to sign certificates using a HashiCorp Vault PKI backend.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>auth</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.VaultAuth">VaultAuth</a>
        </em>
      </td>
      <td>
        <p>Auth configures how cert-manager authenticates with the Vault server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Server is the connection address for the Vault server, e.g: &ldquo;<a href='https://vault.example.com:8200"'>https://vault.example.com:8200&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Path is the mount path of the Vault PKI backend&rsquo;s <code>sign</code> endpoint, e.g: &ldquo;my_pki_mount/sign/my-role-name&rdquo;. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>namespace</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Name of the vault namespace. Namespaces is a set of features within Vault Enterprise that allows Vault environments to support Secure Multi-tenancy. e.g: &ldquo;ns1&rdquo; More about namespaces can be found here <a href="https://www.vaultproject.io/docs/enterprise/namespaces">https://www.vaultproject.io/docs/enterprise/namespaces</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PEM encoded CA bundle used to validate Vault server certificate. Only used if the Server URL is using HTTPS protocol. This parameter is ignored for plain HTTP protocol connection. If not set the system root certificates are used to validate the TLS connection.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.VaultKubernetesAuth">VaultKubernetesAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.VaultAuth">VaultAuth</a>) </p>
<div>
  <p>Authenticate against Vault using a Kubernetes ServiceAccount token stored in a Secret.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>mountPath</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The Vault mountPath here is the mount path to use when authenticating with Vault. For example, setting a value to <code>/v1/auth/foo</code>, will use the path <code>/v1/auth/foo/login</code> to authenticate with Vault. If unspecified, the default value &ldquo;/v1/auth/kubernetes&rdquo; will be used. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>The required Secret field containing a Kubernetes ServiceAccount JWT used for authenticating with Vault. Use of &lsquo;ambient credentials&rsquo; is not supported.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>A required field containing the Vault Role to assume. A Role binds a Kubernetes ServiceAccount with a set of Vault policies.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.VenafiCloud">VenafiCloud</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiCloud defines connection configuration details for Venafi Cloud</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> URL is the base URL for Venafi Cloud. Defaults to &ldquo;<a href='https://api.venafi.cloud/v1"'>https://api.venafi.cloud/v1&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>APITokenSecretRef is a secret key selector for the Venafi Cloud API token.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.VenafiIssuer">VenafiIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to sign certificates using a Venafi TPP or Cloud policy zone.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>zone</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Zone is the Venafi Policy Zone to use for this issuer. All requests made to the Venafi platform will be restricted by the named zone policy. This field is required.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tpp</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.VenafiTPP">VenafiTPP</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>TPP specifies Trust Protection Platform configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloud</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1.VenafiCloud">VenafiCloud</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cloud specifies the Venafi cloud configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.VenafiTPP">VenafiTPP</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiTPP defines connection configuration details for a Venafi TPP instance</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> URL is the base URL for the vedsdk endpoint of the Venafi TPP instance, for example: &ldquo;<a href='https://tpp.example.com/vedsdk"'>https://tpp.example.com/vedsdk&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>credentialsRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.LocalObjectReference">LocalObjectReference</a>
        </em>
      </td>
      <td>
        <p>CredentialsRef is a reference to a Secret containing the username and password for the TPP server. The secret must contain two keys, &lsquo;username&rsquo; and &lsquo;password&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CABundle is a PEM encoded TLS certificate to use to verify connections to the TPP instance. If specified, system roots will not be used and the issuing CA for the TPP instance must be verifiable using the provided root. If not specified, the connection will be verified using the cert-manager system root certificates.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1.X509Subject">X509Subject</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>X509Subject Full X509 name specification</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>organizations</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organizations to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>countries</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Countries to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>organizationalUnits</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organizational Units to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>localities</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cities to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>provinces</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State/Provinces to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>streetAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Street addresses to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>postalCodes</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Postal codes to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>serialNumber</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Serial number to be used on the Certificate.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="cert-manager.io/v1alpha2">cert-manager.io/v1alpha2</h2>
<div>
  <p>Package v1alpha2 is the v1alpha2 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#cert-manager.io/v1alpha2.Certificate">Certificate</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha2.CertificateRequest">CertificateRequest</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha2.ClusterIssuer">ClusterIssuer</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha2.Issuer">Issuer</a>
  </li>
</ul>
<h3 id="cert-manager.io/v1alpha2.Certificate">Certificate</h3>
<div>
  <p> A Certificate resource should be created to ensure an up to date and signed x509 certificate is stored in the Kubernetes Secret resource named in <code>spec.secretName</code>. </p>
  <p> The stored certificate will be renewed before it expires (as configured by <code>spec.renewBefore</code>). </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Certificate</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the Certificate resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>subject</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.X509Subject">X509Subject</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs. This value is ignored by TLS clients when any subject alt name is set. This is x509 behaviour: <a href="https://tools.ietf.org/html/rfc6125#section-6.4.4">https://tools.ietf.org/html/rfc6125#section-6.4.4</a> </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>organization</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Organization is a list of organizations to be used on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types. If overridden and <code>renewBefore</code> is greater than the actual certificate duration, the certificate will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>renewBefore</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>
                The amount of time before the currently issued certificate&rsquo;s <code>notAfter</code>
                time that cert-manager will begin to attempt to renew the certificate. If this value is greater than the total duration of the certificate (i.e. notAfter - notBefore), it will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of DNS subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>ipAddresses</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IPAddresses is a list of IP address subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>uriSANs</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>URISANs is a list of URI subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>emailSANs</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>EmailSANs is a list of email subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>secretName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>SecretName is the name of the secret resource that will be automatically created and managed by this Certificate resource. It will be populated with a private key and certificate, signed by the denoted issuer.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keystores</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.CertificateKeystores">CertificateKeystores</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>
                Keystores configures additional keystore output formats stored in the
                <code>secretName</code> Secret resource.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p> IssuerRef is a reference to the issuer for this certificate. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> IsCA will mark this Certificate as valid for certificate signing. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keySize</code>
              <br />
              <em>int</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> KeySize is the key bit size of the corresponding private key for this certificate. If <code>keyAlgorithm</code> is set to <code>rsa</code>, valid values are <code>2048</code>, <code>4096</code> or <code>8192</code>, and will default to <code>2048</code> if not specified. If <code>keyAlgorithm</code> is set to <code>ecdsa</code>, valid values are <code>256</code>, <code>384</code> or <code>521</code>, and will default to <code>256</code> if not specified. No other values are allowed. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keyAlgorithm</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.KeyAlgorithm">KeyAlgorithm</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> KeyAlgorithm is the private key algorithm of the corresponding private key for this certificate. If provided, allowed values are either <code>rsa</code> or <code>ecdsa</code> If <code>keyAlgorithm</code> is specified and <code>keySize</code> is not provided, key size of 256 will be used for <code>ecdsa</code> key algorithm and key size of 2048 will be used for <code>rsa</code> key algorithm. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keyEncoding</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.KeyEncoding">KeyEncoding</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> KeyEncoding is the private key cryptography standards (PKCS) for this certificate&rsquo;s private key to be encoded in. If provided, allowed values are <code>pkcs1</code> and <code>pkcs8</code> standing for PKCS#1 and PKCS#8, respectively. If KeyEncoding is not specified, then <code>pkcs1</code> will be used by default. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>privateKey</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.CertificatePrivateKey">CertificatePrivateKey</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Options to control private keys used for the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>encodeUsagesInRequest</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>EncodeUsagesInRequest controls whether key usages should be present in the CertificateRequest</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateStatus">CertificateStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the Certificate. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateRequest">CertificateRequest</h3>
<div>
  <p>A CertificateRequest is used to request a signed certificate from one of the configured issuers.</p>
  <p>
    All fields within the CertificateRequest&rsquo;s <code>spec</code> are immutable after creation. A CertificateRequest will either succeed or fail, as denoted by its <code>status.state</code>
    field.
  </p>
  <p>A CertificateRequest is a one-shot resource, meaning it represents a single point in time request for a certificate and cannot be re-used.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>CertificateRequest</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateRequestSpec">CertificateRequestSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the CertificateRequest resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p> IssuerRef is a reference to the issuer for this CertificateRequest. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to <code>cert-manager.io</code> if empty. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>csr</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>The PEM-encoded x509 certificate signing request to be submitted to the CA for signing.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> IsCA will request to mark the certificate as valid for certificate signing when submitting to the issuer. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateRequestStatus">CertificateRequestStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the CertificateRequest. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.ClusterIssuer">ClusterIssuer</h3>
<div>
  <p> A ClusterIssuer represents a certificate issuing authority which can be referenced as part of <code>issuerRef</code> fields. It is similar to an Issuer, however it is cluster-scoped and therefore can be referenced by resources that exist in <em>any</em> namespace, not just the same namespace as the referent. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>ClusterIssuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the ClusterIssuer resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the ClusterIssuer. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.Issuer">Issuer</h3>
<div>
  <p> An Issuer represents a certificate issuing authority which can be referenced as part of <code>issuerRef</code> fields. It is scoped to a single namespace and can therefore only be referenced by resources within the same namespace. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha2</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Issuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the Issuer resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the Issuer. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CAIssuer">CAIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret used to sign Certificates issued by this Issuer.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>crlDistributionPoints</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The CRL distribution points is an X.509 v3 certificate extension which identifies the location of the CRL from which the revocation of this certificate can be checked. If not set, certificates will be issued without distribution points set.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ocspServers</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The OCSP server list is an X.509 v3 extension that defines a list of URLs of OCSP responders. The OCSP responders can be queried for the revocation status of an issued certificate. If not set, the certificate wil be issued with no OCSP servers set. For example, an OCSP server URL could be &ldquo;<a href='http://ocsp.int-x3.letsencrypt.org"'>http://ocsp.int-x3.letsencrypt.org&rdquo;</a>. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateCondition">CertificateCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateStatus">CertificateStatus</a>) </p>
<div>
  <p>CertificateCondition contains condition information for an Certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateConditionType">CertificateConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>, <code>Issuing</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateConditionType"> CertificateConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateCondition">CertificateCondition</a>) </p>
<div>
  <p>CertificateConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Issuing&#34;</p>
      </td>
      <td>
        <p>
          A condition added to Certificate resources when an issuance is required. This condition will be automatically added and set to true if: * No keypair data exists in the target Secret * The data stored in the Secret cannot be decoded * The private key and certificate do not have matching public keys * If a CertificateRequest for the current revision exists and the certificate data stored in the Secret does not match the
          <code>status.certificate</code> on the CertificateRequest. * If no CertificateRequest resource exists for the current revision, the options on the Certificate resource are compared against the x509 data in the Secret, similar to what&rsquo;s done in earlier versions. If there is a mismatch, an issuance is triggered. This condition may also be added by external API consumers to trigger a re-issuance manually for any other reason.
        </p>
        <p>It will be removed by the &lsquo;issuing&rsquo; controller upon completing issuance.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateConditionReady indicates that a certificate is ready for use. This is defined as: - The target secret exists - The target secret contains a certificate that has not expired - The target secret contains a private key valid for the certificate - The commonName and dnsNames attributes match those specified on the Certificate</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateKeystores">CertificateKeystores</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>CertificateKeystores configures additional keystore output formats to be created in the Certificate&rsquo;s output Secret.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>jks</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.JKSKeystore">JKSKeystore</a>
        </em>
      </td>
      <td>
        <p>
          JKS configures options for storing a JKS keystore in the
          <code>spec.secretName</code> Secret resource.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>pkcs12</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.PKCS12Keystore">PKCS12Keystore</a>
        </em>
      </td>
      <td>
        <p>
          PKCS12 configures options for storing a PKCS12 keystore in the
          <code>spec.secretName</code> Secret resource.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificatePrivateKey">CertificatePrivateKey</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>CertificatePrivateKey contains configuration options for private keys used by the Certificate controller. This allows control of how private keys are rotated.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>rotationPolicy</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.PrivateKeyRotationPolicy">PrivateKeyRotationPolicy</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> RotationPolicy controls how private keys should be regenerated when a re-issuance is being processed. If set to Never, a private key will only be generated if one does not already exist in the target <code>spec.secretName</code>. If one does exists but it does not have the correct algorithm or size, a warning will be raised to await user intervention. If set to Always, a private key matching the specified requirements will be generated whenever a re-issuance occurs. Default is &lsquo;Never&rsquo; for backward compatibility. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateRequestCondition">CertificateRequestCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateRequestStatus">CertificateRequestStatus</a>) </p>
<div>
  <p>CertificateRequestCondition contains condition information for a CertificateRequest.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateRequestConditionType">CertificateRequestConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>, <code>InvalidRequest</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateRequestConditionType"> CertificateRequestConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateRequestCondition">CertificateRequestCondition</a>) </p>
<div>
  <p>CertificateRequestConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;InvalidRequest&#34;</p>
      </td>
      <td>
        <p> CertificateRequestConditionInvalidRequest indicates that a certificate signer has refused to sign the request due to at least one of the input parameters being invalid. Additional information about why the request was rejected can be found in the <code>reason</code> and <code>message</code> fields. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateRequestConditionReady indicates that a certificate is ready for use. This is defined as: - The target certificate exists in CertificateRequest.Status</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateRequestSpec">CertificateRequestSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateRequestSpec defines the desired state of CertificateRequest</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p> IssuerRef is a reference to the issuer for this CertificateRequest. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to <code>cert-manager.io</code> if empty. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>csr</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>The PEM-encoded x509 certificate signing request to be submitted to the CA for signing.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> IsCA will request to mark the certificate as valid for certificate signing when submitting to the issuer. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateRequestStatus">CertificateRequestStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateRequestStatus defines the observed state of CertificateRequest and resulting signed certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateRequestCondition">[]CertificateRequestCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of a CertificateRequest. Known condition types are <code>Ready</code> and <code>InvalidRequest</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The PEM encoded x509 certificate resulting from the certificate signing request. If not set, the CertificateRequest has either not been completed or has failed. More information on failure can be found by checking the
          <code>conditions</code> field.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The PEM encoded x509 certificate of the signer, also known as the CA (Certificate Authority). This is set on a best-effort basis by different issuers. If not set, the CA is assumed to be unknown/not available.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this CertificateRequest failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateSpec defines the desired state of Certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>subject</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.X509Subject">X509Subject</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs. This value is ignored by TLS clients when any subject alt name is set. This is x509 behaviour: <a href="https://tools.ietf.org/html/rfc6125#section-6.4.4">https://tools.ietf.org/html/rfc6125#section-6.4.4</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>organization</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organization is a list of organizations to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types. If overridden and <code>renewBefore</code> is greater than the actual certificate duration, the certificate will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>renewBefore</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The amount of time before the currently issued certificate&rsquo;s <code>notAfter</code>
          time that cert-manager will begin to attempt to renew the certificate. If this value is greater than the total duration of the certificate (i.e. notAfter - notBefore), it will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of DNS subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ipAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IPAddresses is a list of IP address subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>uriSANs</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URISANs is a list of URI subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>emailSANs</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>EmailSANs is a list of email subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret resource that will be automatically created and managed by this Certificate resource. It will be populated with a private key and certificate, signed by the denoted issuer.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keystores</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateKeystores">CertificateKeystores</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          Keystores configures additional keystore output formats stored in the
          <code>secretName</code> Secret resource.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p> IssuerRef is a reference to the issuer for this certificate. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> IsCA will mark this Certificate as valid for certificate signing. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keySize</code>
        <br />
        <em>int</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> KeySize is the key bit size of the corresponding private key for this certificate. If <code>keyAlgorithm</code> is set to <code>rsa</code>, valid values are <code>2048</code>, <code>4096</code> or <code>8192</code>, and will default to <code>2048</code> if not specified. If <code>keyAlgorithm</code> is set to <code>ecdsa</code>, valid values are <code>256</code>, <code>384</code> or <code>521</code>, and will default to <code>256</code> if not specified. No other values are allowed. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyAlgorithm</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.KeyAlgorithm">KeyAlgorithm</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> KeyAlgorithm is the private key algorithm of the corresponding private key for this certificate. If provided, allowed values are either <code>rsa</code> or <code>ecdsa</code> If <code>keyAlgorithm</code> is specified and <code>keySize</code> is not provided, key size of 256 will be used for <code>ecdsa</code> key algorithm and key size of 2048 will be used for <code>rsa</code> key algorithm. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyEncoding</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.KeyEncoding">KeyEncoding</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> KeyEncoding is the private key cryptography standards (PKCS) for this certificate&rsquo;s private key to be encoded in. If provided, allowed values are <code>pkcs1</code> and <code>pkcs8</code> standing for PKCS#1 and PKCS#8, respectively. If KeyEncoding is not specified, then <code>pkcs1</code> will be used by default. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>privateKey</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificatePrivateKey">CertificatePrivateKey</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Options to control private keys used for the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>encodeUsagesInRequest</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>EncodeUsagesInRequest controls whether key usages should be present in the CertificateRequest</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.CertificateStatus">CertificateStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateStatus defines the observed state of Certificate</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CertificateCondition">[]CertificateCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of certificates. Known condition types are <code>Ready</code> and <code>Issuing</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastFailureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastFailureTime is the time as recorded by the Certificate controller of the most recent failure to complete a CertificateRequest for this Certificate resource. If set, cert-manager will not re-request another Certificate until 1 hour has elapsed from this time.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>notBefore</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The time after which the certificate stored in the secret named by this resource in spec.secretName is valid.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>notAfter</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The expiration time of the certificate stored in the secret named by this resource in <code>spec.secretName</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>renewalTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>RenewalTime is the time at which the certificate will be next renewed. If not set, no upcoming renewal is scheduled.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>revision</code>
        <br />
        <em>int</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The current &lsquo;revision&rsquo; of the certificate as issued.</p>
        <p>
          When a CertificateRequest resource is created, it will have the
          <code>cert-manager.io/certificate-revision</code> set to one greater than the current value of this field.
        </p>
        <p>Upon issuance, this field will be set to the value of the annotation on the CertificateRequest resource used to issue the certificate.</p>
        <p>Persisting the value on the CertificateRequest resource allows the certificates controller to know whether a request is part of an old issuance or if it is part of the ongoing revision&rsquo;s issuance by checking if the revision value in the annotation is greater than this field.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>nextPrivateKeySecretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The name of the Secret resource containing the private key to be used for the next certificate iteration. The keymanager controller will automatically set this field if the
          <code>Issuing</code> condition is set to <code>True</code>. It will automatically unset this field when the Issuing condition is not set or False.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.GenericIssuer">GenericIssuer</h3>
<div></div>
<h3 id="cert-manager.io/v1alpha2.IssuerCondition">IssuerCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerStatus">IssuerStatus</a>) </p>
<div>
  <p>IssuerCondition contains condition information for an Issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerConditionType">IssuerConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.IssuerConditionType"> IssuerConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerCondition">IssuerCondition</a>) </p>
<div>
  <p>IssuerConditionType represents an Issuer condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p> IssuerConditionReady represents the fact that a given Issuer condition is in ready state and able to issue certificates. If the <code>status</code> of this condition is <code>False</code>, CertificateRequest controllers should prevent attempts to sign certificates. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerSpec">IssuerSpec</a>) </p>
<div>
  <p>The configuration for the issuer. Only one of these can be set.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuer">ACMEIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ACME configures this issuer to communicate with a RFC8555 (ACME) server to obtain signed x509 certificates.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.CAIssuer">CAIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CA configures this issuer to sign certificates using a signing CA keypair stored in a Secret resource. This is used to build internal PKIs that are managed by cert-manager.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>vault</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VaultIssuer">VaultIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Vault configures this issuer to sign certificates using a HashiCorp Vault PKI backend.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>selfSigned</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.SelfSignedIssuer">SelfSignedIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>SelfSigned configures this issuer to &lsquo;self sign&rsquo; certificates using the private key used to create the CertificateRequest object.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>venafi</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VenafiIssuer">VenafiIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Venafi configures this issuer to sign certificates using a Venafi TPP or Venafi Cloud policy zone.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.IssuerSpec">IssuerSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1alpha2.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerSpec is the specification of an Issuer. This includes any configuration required for the issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>IssuerConfig</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>
        </em>
      </td>
      <td>
        <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.IssuerStatus">IssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1alpha2.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerStatus contains status information about an Issuer</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.IssuerCondition">[]IssuerCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of a CertificateRequest. Known condition types are <code>Ready</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerStatus">ACMEIssuerStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ACME specific status options. This field should only be set if the Issuer is configured to use an ACME server to issue certificates.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.JKSKeystore">JKSKeystore</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateKeystores">CertificateKeystores</a>) </p>
<div>
  <p>
    JKS configures options for storing a JKS keystore in the <code>spec.secretName</code>
    Secret resource.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>create</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <p> Create enables JKS keystore creation for the Certificate. If true, a file named <code>keystore.jks</code> will be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code>. The keystore file will only be updated upon re-issuance. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>passwordSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>PasswordSecretRef is a reference to a key in a Secret resource containing the password used to encrypt the JKS keystore.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.KeyAlgorithm"> KeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;ecdsa&#34;</p>
      </td>
      <td>
        <p>Denotes the ECDSA private key type.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;rsa&#34;</p>
      </td>
      <td>
        <p>Denotes the RSA private key type.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.KeyEncoding"> KeyEncoding (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;pkcs1&#34;</p>
      </td>
      <td>
        <p> PKCS1 key encoding will produce PEM files that include the type of private key as part of the PEM header, e.g. <code>BEGIN RSA PRIVATE KEY</code>. If the keyAlgorithm is set to &lsquo;ECDSA&rsquo;, this will produce private keys that use the <code>BEGIN EC PRIVATE KEY</code> header. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;pkcs8&#34;</p>
      </td>
      <td>
        <p>
          PKCS8 key encoding will produce PEM files with the <code>BEGIN PRIVATE KEY</code>
          header. It encodes the keyAlgorithm of the private key as part of the DER encoded PEM block.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.KeyUsage"> KeyUsage (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateRequestSpec">CertificateRequestSpec</a>, <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>
    KeyUsage specifies valid usage contexts for keys. See: <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.3">https://tools.ietf.org/html/rfc5280#section-4.2.1.3</a>
    <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.12">https://tools.ietf.org/html/rfc5280#section-4.2.1.12</a>
    Valid KeyUsage values are as follows: &ldquo;signing&rdquo;, &ldquo;digital signature&rdquo;, &ldquo;content commitment&rdquo;, &ldquo;key encipherment&rdquo;, &ldquo;key agreement&rdquo;, &ldquo;data encipherment&rdquo;, &ldquo;cert sign&rdquo;, &ldquo;crl sign&rdquo;, &ldquo;encipher only&rdquo;, &ldquo;decipher only&rdquo;, &ldquo;any&rdquo;, &ldquo;server auth&rdquo;, &ldquo;client auth&rdquo;, &ldquo;code signing&rdquo;, &ldquo;email protection&rdquo;, &ldquo;s/mime&rdquo;, &ldquo;ipsec end system&rdquo;, &ldquo;ipsec tunnel&rdquo;, &ldquo;ipsec user&rdquo;, &ldquo;timestamping&rdquo;, &ldquo;ocsp signing&rdquo;, &ldquo;microsoft sgc&rdquo;, &ldquo;netscape sgc&rdquo;
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;any&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;crl sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;cert sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;client auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;code signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;content commitment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;data encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;decipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;digital signature&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;email protection&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;encipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec end system&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec tunnel&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec user&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key agreement&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;microsoft sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;netscape sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ocsp signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;s/mime&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;server auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;timestamping&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.PKCS12Keystore">PKCS12Keystore</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateKeystores">CertificateKeystores</a>) </p>
<div>
  <p>
    PKCS12 configures options for storing a PKCS12 keystore in the
    <code>spec.secretName</code> Secret resource.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>create</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <p> Create enables PKCS12 keystore creation for the Certificate. If true, a file named <code>keystore.p12</code> will be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code>. The keystore file will only be updated upon re-issuance. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>passwordSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>PasswordSecretRef is a reference to a key in a Secret resource containing the password used to encrypt the PKCS12 keystore.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.PrivateKeyRotationPolicy"> PrivateKeyRotationPolicy (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificatePrivateKey">CertificatePrivateKey</a>) </p>
<div>
  <p>Denotes how private keys should be generated or sourced when a Certificate is being issued.</p>
</div>
<h3 id="cert-manager.io/v1alpha2.SelfSignedIssuer">SelfSignedIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to &lsquo;self sign&rsquo; certificates using the private key used to create the CertificateRequest object.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>crlDistributionPoints</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The CRL distribution points is an X.509 v3 certificate extension which identifies the location of the CRL from which the revocation of this certificate can be checked. If not set certificate will be issued without CDP. Values are strings.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VaultAppRole">VaultAppRole</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.VaultAuth">VaultAuth</a>) </p>
<div>
  <p>VaultAppRole authenticates with Vault using the App Role auth mechanism, with the role and secret stored in a Kubernetes Secret resource.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Path where the App Role authentication backend is mounted in Vault, e.g: &ldquo;approle&rdquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>roleId</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>RoleID configured in the App Role authentication backend when setting up the authentication backend in Vault.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> Reference to a key in a Secret that contains the App Role secret used to authenticate with Vault. The <code>key</code> field must be specified and denotes which entry within the Secret resource is used as the app role secret. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VaultAuth">VaultAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.VaultIssuer">VaultIssuer</a>) </p>
<div>
  <p> Configuration used to authenticate with a Vault server. Only one of <code>tokenSecretRef</code>, <code>appRole</code> or <code>kubernetes</code> may be specified. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>TokenSecretRef authenticates with Vault by presenting a token.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>appRole</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VaultAppRole">VaultAppRole</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>AppRole authenticates with Vault using the App Role auth mechanism, with the role and secret stored in a Kubernetes Secret resource.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>kubernetes</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VaultKubernetesAuth">VaultKubernetesAuth</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Kubernetes authenticates with Vault by passing the ServiceAccount token stored in the named Secret resource to the Vault server.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VaultIssuer">VaultIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to sign certificates using a HashiCorp Vault PKI backend.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>auth</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VaultAuth">VaultAuth</a>
        </em>
      </td>
      <td>
        <p>Auth configures how cert-manager authenticates with the Vault server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Server is the connection address for the Vault server, e.g: &ldquo;<a href='https://vault.example.com:8200"'>https://vault.example.com:8200&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Path is the mount path of the Vault PKI backend&rsquo;s <code>sign</code> endpoint, e.g: &ldquo;my_pki_mount/sign/my-role-name&rdquo;. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>namespace</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Name of the vault namespace. Namespaces is a set of features within Vault Enterprise that allows Vault environments to support Secure Multi-tenancy. e.g: &ldquo;ns1&rdquo; More about namespaces can be found here <a href="https://www.vaultproject.io/docs/enterprise/namespaces">https://www.vaultproject.io/docs/enterprise/namespaces</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PEM encoded CA bundle used to validate Vault server certificate. Only used if the Server URL is using HTTPS protocol. This parameter is ignored for plain HTTP protocol connection. If not set the system root certificates are used to validate the TLS connection.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VaultKubernetesAuth">VaultKubernetesAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.VaultAuth">VaultAuth</a>) </p>
<div>
  <p>Authenticate against Vault using a Kubernetes ServiceAccount token stored in a Secret.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>mountPath</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The Vault mountPath here is the mount path to use when authenticating with Vault. For example, setting a value to <code>/v1/auth/foo</code>, will use the path <code>/v1/auth/foo/login</code> to authenticate with Vault. If unspecified, the default value &ldquo;/v1/auth/kubernetes&rdquo; will be used. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>The required Secret field containing a Kubernetes ServiceAccount JWT used for authenticating with Vault. Use of &lsquo;ambient credentials&rsquo; is not supported.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>A required field containing the Vault Role to assume. A Role binds a Kubernetes ServiceAccount with a set of Vault policies.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VenafiCloud">VenafiCloud</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiCloud defines connection configuration details for Venafi Cloud</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> URL is the base URL for Venafi Cloud. Defaults to &ldquo;<a href='https://api.venafi.cloud/v1"'>https://api.venafi.cloud/v1&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>APITokenSecretRef is a secret key selector for the Venafi Cloud API token.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VenafiIssuer">VenafiIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to sign certificates using a Venafi TPP or Cloud policy zone.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>zone</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Zone is the Venafi Policy Zone to use for this issuer. All requests made to the Venafi platform will be restricted by the named zone policy. This field is required.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tpp</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VenafiTPP">VenafiTPP</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>TPP specifies Trust Protection Platform configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloud</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha2.VenafiCloud">VenafiCloud</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cloud specifies the Venafi cloud configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.VenafiTPP">VenafiTPP</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiTPP defines connection configuration details for a Venafi TPP instance</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> URL is the base URL for the vedsdk endpoint of the Venafi TPP instance, for example: &ldquo;<a href='https://tpp.example.com/vedsdk"'>https://tpp.example.com/vedsdk&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>credentialsRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.LocalObjectReference">LocalObjectReference</a>
        </em>
      </td>
      <td>
        <p>CredentialsRef is a reference to a Secret containing the username and password for the TPP server. The secret must contain two keys, &lsquo;username&rsquo; and &lsquo;password&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CABundle is a PEM encoded TLS certificate to use to verify connections to the TPP instance. If specified, system roots will not be used and the issuing CA for the TPP instance must be verifiable using the provided root. If not specified, the connection will be verified using the cert-manager system root certificates.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha2.X509Subject">X509Subject</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>X509Subject Full X509 name specification</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>countries</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Countries to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>organizationalUnits</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organizational Units to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>localities</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cities to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>provinces</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State/Provinces to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>streetAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Street addresses to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>postalCodes</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Postal codes to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>serialNumber</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Serial number to be used on the Certificate.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="cert-manager.io/v1alpha3">cert-manager.io/v1alpha3</h2>
<div>
  <p>Package v1alpha3 is the v1alpha3 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#cert-manager.io/v1alpha3.Certificate">Certificate</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha3.CertificateRequest">CertificateRequest</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha3.ClusterIssuer">ClusterIssuer</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1alpha3.Issuer">Issuer</a>
  </li>
</ul>
<h3 id="cert-manager.io/v1alpha3.Certificate">Certificate</h3>
<div>
  <p> A Certificate resource should be created to ensure an up to date and signed x509 certificate is stored in the Kubernetes Secret resource named in <code>spec.secretName</code>. </p>
  <p> The stored certificate will be renewed before it expires (as configured by <code>spec.renewBefore</code>). </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Certificate</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the Certificate resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>subject</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.X509Subject">X509Subject</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs. This value is ignored by TLS clients when any subject alt name is set. This is x509 behaviour: <a href="https://tools.ietf.org/html/rfc6125#section-6.4.4">https://tools.ietf.org/html/rfc6125#section-6.4.4</a> </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types. If overridden and <code>renewBefore</code> is greater than the actual certificate duration, the certificate will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>renewBefore</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>
                The amount of time before the currently issued certificate&rsquo;s <code>notAfter</code>
                time that cert-manager will begin to attempt to renew the certificate. If this value is greater than the total duration of the certificate (i.e. notAfter - notBefore), it will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of DNS subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>ipAddresses</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IPAddresses is a list of IP address subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>uriSANs</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>URISANs is a list of URI subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>emailSANs</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>EmailSANs is a list of email subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>secretName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>SecretName is the name of the secret resource that will be automatically created and managed by this Certificate resource. It will be populated with a private key and certificate, signed by the denoted issuer.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keystores</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.CertificateKeystores">CertificateKeystores</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>
                Keystores configures additional keystore output formats stored in the
                <code>secretName</code> Secret resource.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p> IssuerRef is a reference to the issuer for this certificate. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> IsCA will mark this Certificate as valid for certificate signing. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keySize</code>
              <br />
              <em>int</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> KeySize is the key bit size of the corresponding private key for this certificate. If <code>keyAlgorithm</code> is set to <code>rsa</code>, valid values are <code>2048</code>, <code>4096</code> or <code>8192</code>, and will default to <code>2048</code> if not specified. If <code>keyAlgorithm</code> is set to <code>ecdsa</code>, valid values are <code>256</code>, <code>384</code> or <code>521</code>, and will default to <code>256</code> if not specified. No other values are allowed. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keyAlgorithm</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.KeyAlgorithm">KeyAlgorithm</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> KeyAlgorithm is the private key algorithm of the corresponding private key for this certificate. If provided, allowed values are either <code>rsa</code> or <code>ecdsa</code> If <code>keyAlgorithm</code> is specified and <code>keySize</code> is not provided, key size of 256 will be used for <code>ecdsa</code> key algorithm and key size of 2048 will be used for <code>rsa</code> key algorithm. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keyEncoding</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.KeyEncoding">KeyEncoding</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> KeyEncoding is the private key cryptography standards (PKCS) for this certificate&rsquo;s private key to be encoded in. If provided, allowed values are <code>pkcs1</code> and <code>pkcs8</code> standing for PKCS#1 and PKCS#8, respectively. If KeyEncoding is not specified, then <code>pkcs1</code> will be used by default. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>privateKey</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.CertificatePrivateKey">CertificatePrivateKey</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Options to control private keys used for the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>encodeUsagesInRequest</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>EncodeUsagesInRequest controls whether key usages should be present in the CertificateRequest</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateStatus">CertificateStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the Certificate. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateRequest">CertificateRequest</h3>
<div>
  <p>A CertificateRequest is used to request a signed certificate from one of the configured issuers.</p>
  <p>
    All fields within the CertificateRequest&rsquo;s <code>spec</code> are immutable after creation. A CertificateRequest will either succeed or fail, as denoted by its <code>status.state</code>
    field.
  </p>
  <p>A CertificateRequest is a one-shot resource, meaning it represents a single point in time request for a certificate and cannot be re-used.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>CertificateRequest</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateRequestSpec">CertificateRequestSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the CertificateRequest resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p> IssuerRef is a reference to the issuer for this CertificateRequest. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to <code>cert-manager.io</code> if empty. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>csr</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>The PEM-encoded x509 certificate signing request to be submitted to the CA for signing.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> IsCA will request to mark the certificate as valid for certificate signing when submitting to the issuer. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateRequestStatus">CertificateRequestStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the CertificateRequest. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.ClusterIssuer">ClusterIssuer</h3>
<div>
  <p> A ClusterIssuer represents a certificate issuing authority which can be referenced as part of <code>issuerRef</code> fields. It is similar to an Issuer, however it is cluster-scoped and therefore can be referenced by resources that exist in <em>any</em> namespace, not just the same namespace as the referent. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>ClusterIssuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the ClusterIssuer resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the ClusterIssuer. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.Issuer">Issuer</h3>
<div>
  <p> An Issuer represents a certificate issuing authority which can be referenced as part of <code>issuerRef</code> fields. It is scoped to a single namespace and can therefore only be referenced by resources within the same namespace. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1alpha3</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Issuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the Issuer resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td>
        <p>Status of the Issuer. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CAIssuer">CAIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret used to sign Certificates issued by this Issuer.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>crlDistributionPoints</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The CRL distribution points is an X.509 v3 certificate extension which identifies the location of the CRL from which the revocation of this certificate can be checked. If not set, certificates will be issued without distribution points set.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ocspServers</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The OCSP server list is an X.509 v3 extension that defines a list of URLs of OCSP responders. The OCSP responders can be queried for the revocation status of an issued certificate. If not set, the certificate wil be issued with no OCSP servers set. For example, an OCSP server URL could be &ldquo;<a href='http://ocsp.int-x3.letsencrypt.org"'>http://ocsp.int-x3.letsencrypt.org&rdquo;</a>. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateCondition">CertificateCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateStatus">CertificateStatus</a>) </p>
<div>
  <p>CertificateCondition contains condition information for an Certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateConditionType">CertificateConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>, <code>Issuing</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateConditionType"> CertificateConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateCondition">CertificateCondition</a>) </p>
<div>
  <p>CertificateConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Issuing&#34;</p>
      </td>
      <td>
        <p>
          A condition added to Certificate resources when an issuance is required. This condition will be automatically added and set to true if: * No keypair data exists in the target Secret * The data stored in the Secret cannot be decoded * The private key and certificate do not have matching public keys * If a CertificateRequest for the current revision exists and the certificate data stored in the Secret does not match the
          <code>status.certificate</code> on the CertificateRequest. * If no CertificateRequest resource exists for the current revision, the options on the Certificate resource are compared against the x509 data in the Secret, similar to what&rsquo;s done in earlier versions. If there is a mismatch, an issuance is triggered. This condition may also be added by external API consumers to trigger a re-issuance manually for any other reason.
        </p>
        <p>It will be removed by the &lsquo;issuing&rsquo; controller upon completing issuance.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateConditionReady indicates that a certificate is ready for use. This is defined as: - The target secret exists - The target secret contains a certificate that has not expired - The target secret contains a private key valid for the certificate - The commonName and dnsNames attributes match those specified on the Certificate</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateKeystores">CertificateKeystores</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>CertificateKeystores configures additional keystore output formats to be created in the Certificate&rsquo;s output Secret.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>jks</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.JKSKeystore">JKSKeystore</a>
        </em>
      </td>
      <td>
        <p>
          JKS configures options for storing a JKS keystore in the
          <code>spec.secretName</code> Secret resource.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>pkcs12</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.PKCS12Keystore">PKCS12Keystore</a>
        </em>
      </td>
      <td>
        <p>
          PKCS12 configures options for storing a PKCS12 keystore in the
          <code>spec.secretName</code> Secret resource.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificatePrivateKey">CertificatePrivateKey</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>CertificatePrivateKey contains configuration options for private keys used by the Certificate controller. This allows control of how private keys are rotated.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>rotationPolicy</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.PrivateKeyRotationPolicy">PrivateKeyRotationPolicy</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> RotationPolicy controls how private keys should be regenerated when a re-issuance is being processed. If set to Never, a private key will only be generated if one does not already exist in the target <code>spec.secretName</code>. If one does exists but it does not have the correct algorithm or size, a warning will be raised to await user intervention. If set to Always, a private key matching the specified requirements will be generated whenever a re-issuance occurs. Default is &lsquo;Never&rsquo; for backward compatibility. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateRequestCondition">CertificateRequestCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateRequestStatus">CertificateRequestStatus</a>) </p>
<div>
  <p>CertificateRequestCondition contains condition information for a CertificateRequest.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateRequestConditionType">CertificateRequestConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>, <code>InvalidRequest</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateRequestConditionType"> CertificateRequestConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateRequestCondition">CertificateRequestCondition</a>) </p>
<div>
  <p>CertificateRequestConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;InvalidRequest&#34;</p>
      </td>
      <td>
        <p> CertificateRequestConditionInvalidRequest indicates that a certificate signer has refused to sign the request due to at least one of the input parameters being invalid. Additional information about why the request was rejected can be found in the <code>reason</code> and <code>message</code> fields. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateRequestConditionReady indicates that a certificate is ready for use. This is defined as: - The target certificate exists in CertificateRequest.Status</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateRequestSpec">CertificateRequestSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateRequestSpec defines the desired state of CertificateRequest</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p> IssuerRef is a reference to the issuer for this CertificateRequest. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to <code>cert-manager.io</code> if empty. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>csr</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>The PEM-encoded x509 certificate signing request to be submitted to the CA for signing.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> IsCA will request to mark the certificate as valid for certificate signing when submitting to the issuer. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateRequestStatus">CertificateRequestStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateRequestStatus defines the observed state of CertificateRequest and resulting signed certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateRequestCondition">[]CertificateRequestCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of a CertificateRequest. Known condition types are <code>Ready</code> and <code>InvalidRequest</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The PEM encoded x509 certificate resulting from the certificate signing request. If not set, the CertificateRequest has either not been completed or has failed. More information on failure can be found by checking the
          <code>conditions</code> field.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The PEM encoded x509 certificate of the signer, also known as the CA (Certificate Authority). This is set on a best-effort basis by different issuers. If not set, the CA is assumed to be unknown/not available.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this CertificateRequest failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateSpec defines the desired state of Certificate. A valid Certificate requires at least one of a CommonName, DNSName, or URISAN to be valid.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>subject</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.X509Subject">X509Subject</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs. This value is ignored by TLS clients when any subject alt name is set. This is x509 behaviour: <a href="https://tools.ietf.org/html/rfc6125#section-6.4.4">https://tools.ietf.org/html/rfc6125#section-6.4.4</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types. If overridden and <code>renewBefore</code> is greater than the actual certificate duration, the certificate will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>renewBefore</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The amount of time before the currently issued certificate&rsquo;s <code>notAfter</code>
          time that cert-manager will begin to attempt to renew the certificate. If this value is greater than the total duration of the certificate (i.e. notAfter - notBefore), it will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of DNS subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ipAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IPAddresses is a list of IP address subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>uriSANs</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URISANs is a list of URI subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>emailSANs</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>EmailSANs is a list of email subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret resource that will be automatically created and managed by this Certificate resource. It will be populated with a private key and certificate, signed by the denoted issuer.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keystores</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateKeystores">CertificateKeystores</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          Keystores configures additional keystore output formats stored in the
          <code>secretName</code> Secret resource.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p> IssuerRef is a reference to the issuer for this certificate. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> IsCA will mark this Certificate as valid for certificate signing. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keySize</code>
        <br />
        <em>int</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> KeySize is the key bit size of the corresponding private key for this certificate. If <code>keyAlgorithm</code> is set to <code>rsa</code>, valid values are <code>2048</code>, <code>4096</code> or <code>8192</code>, and will default to <code>2048</code> if not specified. If <code>keyAlgorithm</code> is set to <code>ecdsa</code>, valid values are <code>256</code>, <code>384</code> or <code>521</code>, and will default to <code>256</code> if not specified. No other values are allowed. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyAlgorithm</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.KeyAlgorithm">KeyAlgorithm</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> KeyAlgorithm is the private key algorithm of the corresponding private key for this certificate. If provided, allowed values are either <code>rsa</code> or <code>ecdsa</code> If <code>keyAlgorithm</code> is specified and <code>keySize</code> is not provided, key size of 256 will be used for <code>ecdsa</code> key algorithm and key size of 2048 will be used for <code>rsa</code> key algorithm. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keyEncoding</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.KeyEncoding">KeyEncoding</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> KeyEncoding is the private key cryptography standards (PKCS) for this certificate&rsquo;s private key to be encoded in. If provided, allowed values are <code>pkcs1</code> and <code>pkcs8</code> standing for PKCS#1 and PKCS#8, respectively. If KeyEncoding is not specified, then <code>pkcs1</code> will be used by default. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>privateKey</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificatePrivateKey">CertificatePrivateKey</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Options to control private keys used for the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>encodeUsagesInRequest</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>EncodeUsagesInRequest controls whether key usages should be present in the CertificateRequest</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.CertificateStatus">CertificateStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateStatus defines the observed state of Certificate</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CertificateCondition">[]CertificateCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of certificates. Known condition types are <code>Ready</code> and <code>Issuing</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastFailureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastFailureTime is the time as recorded by the Certificate controller of the most recent failure to complete a CertificateRequest for this Certificate resource. If set, cert-manager will not re-request another Certificate until 1 hour has elapsed from this time.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>notBefore</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The time after which the certificate stored in the secret named by this resource in spec.secretName is valid.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>notAfter</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The expiration time of the certificate stored in the secret named by this resource in <code>spec.secretName</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>renewalTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>RenewalTime is the time at which the certificate will be next renewed. If not set, no upcoming renewal is scheduled.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>revision</code>
        <br />
        <em>int</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The current &lsquo;revision&rsquo; of the certificate as issued.</p>
        <p>
          When a CertificateRequest resource is created, it will have the
          <code>cert-manager.io/certificate-revision</code> set to one greater than the current value of this field.
        </p>
        <p>Upon issuance, this field will be set to the value of the annotation on the CertificateRequest resource used to issue the certificate.</p>
        <p>Persisting the value on the CertificateRequest resource allows the certificates controller to know whether a request is part of an old issuance or if it is part of the ongoing revision&rsquo;s issuance by checking if the revision value in the annotation is greater than this field.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>nextPrivateKeySecretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The name of the Secret resource containing the private key to be used for the next certificate iteration. The keymanager controller will automatically set this field if the
          <code>Issuing</code> condition is set to <code>True</code>. It will automatically unset this field when the Issuing condition is not set or False.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.GenericIssuer">GenericIssuer</h3>
<div></div>
<h3 id="cert-manager.io/v1alpha3.IssuerCondition">IssuerCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerStatus">IssuerStatus</a>) </p>
<div>
  <p>IssuerCondition contains condition information for an Issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerConditionType">IssuerConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.IssuerConditionType"> IssuerConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerCondition">IssuerCondition</a>) </p>
<div>
  <p>IssuerConditionType represents an Issuer condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p> IssuerConditionReady represents the fact that a given Issuer condition is in ready state and able to issue certificates. If the <code>status</code> of this condition is <code>False</code>, CertificateRequest controllers should prevent attempts to sign certificates. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerSpec">IssuerSpec</a>) </p>
<div>
  <p>The configuration for the issuer. Only one of these can be set.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuer">ACMEIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ACME configures this issuer to communicate with a RFC8555 (ACME) server to obtain signed x509 certificates.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.CAIssuer">CAIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CA configures this issuer to sign certificates using a signing CA keypair stored in a Secret resource. This is used to build internal PKIs that are managed by cert-manager.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>vault</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VaultIssuer">VaultIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Vault configures this issuer to sign certificates using a HashiCorp Vault PKI backend.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>selfSigned</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.SelfSignedIssuer">SelfSignedIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>SelfSigned configures this issuer to &lsquo;self sign&rsquo; certificates using the private key used to create the CertificateRequest object.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>venafi</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VenafiIssuer">VenafiIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Venafi configures this issuer to sign certificates using a Venafi TPP or Venafi Cloud policy zone.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.IssuerSpec">IssuerSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1alpha3.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerSpec is the specification of an Issuer. This includes any configuration required for the issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>IssuerConfig</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>
        </em>
      </td>
      <td>
        <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.IssuerStatus">IssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1alpha3.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerStatus contains status information about an Issuer</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.IssuerCondition">[]IssuerCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of a CertificateRequest. Known condition types are <code>Ready</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerStatus">ACMEIssuerStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ACME specific status options. This field should only be set if the Issuer is configured to use an ACME server to issue certificates.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.JKSKeystore">JKSKeystore</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateKeystores">CertificateKeystores</a>) </p>
<div>
  <p>
    JKS configures options for storing a JKS keystore in the <code>spec.secretName</code>
    Secret resource.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>create</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <p> Create enables JKS keystore creation for the Certificate. If true, a file named <code>keystore.jks</code> will be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code>. The keystore file will only be updated upon re-issuance. A file named <code>truststore.jks</code> will also be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code> containing the issuing Certificate Authority. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>passwordSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>PasswordSecretRef is a reference to a key in a Secret resource containing the password used to encrypt the JKS keystore.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.KeyAlgorithm"> KeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;ecdsa&#34;</p>
      </td>
      <td>
        <p>Denotes the ECDSA private key type.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;rsa&#34;</p>
      </td>
      <td>
        <p>Denotes the RSA private key type.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.KeyEncoding"> KeyEncoding (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;pkcs1&#34;</p>
      </td>
      <td>
        <p> PKCS1 key encoding will produce PEM files that include the type of private key as part of the PEM header, e.g. <code>BEGIN RSA PRIVATE KEY</code>. If the keyAlgorithm is set to <code>ecdsa</code>, this will produce private keys that use the <code>BEGIN EC PRIVATE KEY</code> header. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;pkcs8&#34;</p>
      </td>
      <td>
        <p>
          PKCS8 key encoding will produce PEM files with the <code>BEGIN PRIVATE KEY</code>
          header. It encodes the keyAlgorithm of the private key as part of the DER encoded PEM block.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.KeyUsage"> KeyUsage (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateRequestSpec">CertificateRequestSpec</a>, <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>
    KeyUsage specifies valid usage contexts for keys. See: <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.3">https://tools.ietf.org/html/rfc5280#section-4.2.1.3</a>
    <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.12">https://tools.ietf.org/html/rfc5280#section-4.2.1.12</a>
    Valid KeyUsage values are as follows: &ldquo;signing&rdquo;, &ldquo;digital signature&rdquo;, &ldquo;content commitment&rdquo;, &ldquo;key encipherment&rdquo;, &ldquo;key agreement&rdquo;, &ldquo;data encipherment&rdquo;, &ldquo;cert sign&rdquo;, &ldquo;crl sign&rdquo;, &ldquo;encipher only&rdquo;, &ldquo;decipher only&rdquo;, &ldquo;any&rdquo;, &ldquo;server auth&rdquo;, &ldquo;client auth&rdquo;, &ldquo;code signing&rdquo;, &ldquo;email protection&rdquo;, &ldquo;s/mime&rdquo;, &ldquo;ipsec end system&rdquo;, &ldquo;ipsec tunnel&rdquo;, &ldquo;ipsec user&rdquo;, &ldquo;timestamping&rdquo;, &ldquo;ocsp signing&rdquo;, &ldquo;microsoft sgc&rdquo;, &ldquo;netscape sgc&rdquo;
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;any&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;crl sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;cert sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;client auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;code signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;content commitment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;data encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;decipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;digital signature&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;email protection&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;encipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec end system&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec tunnel&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec user&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key agreement&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;microsoft sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;netscape sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ocsp signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;s/mime&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;server auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;timestamping&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.PKCS12Keystore">PKCS12Keystore</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateKeystores">CertificateKeystores</a>) </p>
<div>
  <p>
    PKCS12 configures options for storing a PKCS12 keystore in the
    <code>spec.secretName</code> Secret resource.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>create</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <p> Create enables PKCS12 keystore creation for the Certificate. If true, a file named <code>keystore.p12</code> will be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code>. The keystore file will only be updated upon re-issuance. A file named <code>truststore.p12</code> will also be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code> containing the issuing Certificate Authority. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>passwordSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>PasswordSecretRef is a reference to a key in a Secret resource containing the password used to encrypt the PKCS12 keystore.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.PrivateKeyRotationPolicy"> PrivateKeyRotationPolicy (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificatePrivateKey">CertificatePrivateKey</a>) </p>
<div>
  <p>Denotes how private keys should be generated or sourced when a Certificate is being issued.</p>
</div>
<h3 id="cert-manager.io/v1alpha3.SelfSignedIssuer">SelfSignedIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to &lsquo;self sign&rsquo; certificates using the private key used to create the CertificateRequest object.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>crlDistributionPoints</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The CRL distribution points is an X.509 v3 certificate extension which identifies the location of the CRL from which the revocation of this certificate can be checked. If not set certificate will be issued without CDP. Values are strings.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VaultAppRole">VaultAppRole</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.VaultAuth">VaultAuth</a>) </p>
<div>
  <p>VaultAppRole authenticates with Vault using the App Role auth mechanism, with the role and secret stored in a Kubernetes Secret resource.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Path where the App Role authentication backend is mounted in Vault, e.g: &ldquo;approle&rdquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>roleId</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>RoleID configured in the App Role authentication backend when setting up the authentication backend in Vault.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> Reference to a key in a Secret that contains the App Role secret used to authenticate with Vault. The <code>key</code> field must be specified and denotes which entry within the Secret resource is used as the app role secret. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VaultAuth">VaultAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.VaultIssuer">VaultIssuer</a>) </p>
<div>
  <p> Configuration used to authenticate with a Vault server. Only one of <code>tokenSecretRef</code>, <code>appRole</code> or <code>kubernetes</code> may be specified. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>TokenSecretRef authenticates with Vault by presenting a token.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>appRole</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VaultAppRole">VaultAppRole</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>AppRole authenticates with Vault using the App Role auth mechanism, with the role and secret stored in a Kubernetes Secret resource.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>kubernetes</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VaultKubernetesAuth">VaultKubernetesAuth</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Kubernetes authenticates with Vault by passing the ServiceAccount token stored in the named Secret resource to the Vault server.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VaultIssuer">VaultIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to sign certificates using a HashiCorp Vault PKI backend.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>auth</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VaultAuth">VaultAuth</a>
        </em>
      </td>
      <td>
        <p>Auth configures how cert-manager authenticates with the Vault server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Server is the connection address for the Vault server, e.g: &ldquo;<a href='https://vault.example.com:8200"'>https://vault.example.com:8200&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Path is the mount path of the Vault PKI backend&rsquo;s <code>sign</code> endpoint, e.g: &ldquo;my_pki_mount/sign/my-role-name&rdquo;. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>namespace</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Name of the vault namespace. Namespaces is a set of features within Vault Enterprise that allows Vault environments to support Secure Multi-tenancy. e.g: &ldquo;ns1&rdquo; More about namespaces can be found here <a href="https://www.vaultproject.io/docs/enterprise/namespaces">https://www.vaultproject.io/docs/enterprise/namespaces</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PEM encoded CA bundle used to validate Vault server certificate. Only used if the Server URL is using HTTPS protocol. This parameter is ignored for plain HTTP protocol connection. If not set the system root certificates are used to validate the TLS connection.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VaultKubernetesAuth">VaultKubernetesAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.VaultAuth">VaultAuth</a>) </p>
<div>
  <p>Authenticate against Vault using a Kubernetes ServiceAccount token stored in a Secret.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>mountPath</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The Vault mountPath here is the mount path to use when authenticating with Vault. For example, setting a value to <code>/v1/auth/foo</code>, will use the path <code>/v1/auth/foo/login</code> to authenticate with Vault. If unspecified, the default value &ldquo;/v1/auth/kubernetes&rdquo; will be used. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>The required Secret field containing a Kubernetes ServiceAccount JWT used for authenticating with Vault. Use of &lsquo;ambient credentials&rsquo; is not supported.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>A required field containing the Vault Role to assume. A Role binds a Kubernetes ServiceAccount with a set of Vault policies.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VenafiCloud">VenafiCloud</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiCloud defines connection configuration details for Venafi Cloud</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> URL is the base URL for Venafi Cloud. Defaults to &ldquo;<a href='https://api.venafi.cloud/v1"'>https://api.venafi.cloud/v1&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>APITokenSecretRef is a secret key selector for the Venafi Cloud API token.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VenafiIssuer">VenafiIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to sign certificates using a Venafi TPP or Cloud policy zone.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>zone</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Zone is the Venafi Policy Zone to use for this issuer. All requests made to the Venafi platform will be restricted by the named zone policy. This field is required.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tpp</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VenafiTPP">VenafiTPP</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>TPP specifies Trust Protection Platform configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloud</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1alpha3.VenafiCloud">VenafiCloud</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cloud specifies the Venafi cloud configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.VenafiTPP">VenafiTPP</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiTPP defines connection configuration details for a Venafi TPP instance</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> URL is the base URL for the vedsdk endpoint of the Venafi TPP instance, for example: &ldquo;<a href='https://tpp.example.com/vedsdk"'>https://tpp.example.com/vedsdk&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>credentialsRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.LocalObjectReference">LocalObjectReference</a>
        </em>
      </td>
      <td>
        <p>CredentialsRef is a reference to a Secret containing the username and password for the TPP server. The secret must contain two keys, &lsquo;username&rsquo; and &lsquo;password&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CABundle is a PEM encoded TLS certificate to use to verify connections to the TPP instance. If specified, system roots will not be used and the issuing CA for the TPP instance must be verifiable using the provided root. If not specified, the connection will be verified using the cert-manager system root certificates.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1alpha3.X509Subject">X509Subject</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>X509Subject Full X509 name specification</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>organizations</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organizations to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>countries</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Countries to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>organizationalUnits</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organizational Units to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>localities</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cities to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>provinces</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State/Provinces to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>streetAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Street addresses to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>postalCodes</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Postal codes to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>serialNumber</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Serial number to be used on the Certificate.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="cert-manager.io/v1beta1">cert-manager.io/v1beta1</h2>
<div>
  <p>Package v1beta1 is the v1beta1 version of the API.</p>
</div>
Resource Types:
<ul>
  <li>
    <a href="#cert-manager.io/v1beta1.Certificate">Certificate</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1beta1.CertificateRequest">CertificateRequest</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1beta1.ClusterIssuer">ClusterIssuer</a>
  </li>
  <li>
    <a href="#cert-manager.io/v1beta1.Issuer">Issuer</a>
  </li>
</ul>
<h3 id="cert-manager.io/v1beta1.Certificate">Certificate</h3>
<div>
  <p> A Certificate resource should be created to ensure an up to date and signed x509 certificate is stored in the Kubernetes Secret resource named in <code>spec.secretName</code>. </p>
  <p> The stored certificate will be renewed before it expires (as configured by <code>spec.renewBefore</code>). </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1beta1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Certificate</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.CertificateSpec">CertificateSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the Certificate resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>subject</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1beta1.X509Subject">X509Subject</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>commonName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs. This value is ignored by TLS clients when any subject alt name is set. This is x509 behaviour: <a href="https://tools.ietf.org/html/rfc6125#section-6.4.4">https://tools.ietf.org/html/rfc6125#section-6.4.4</a> </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types. If overridden and <code>renewBefore</code> is greater than the actual certificate duration, the certificate will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>renewBefore</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>
                The amount of time before the currently issued certificate&rsquo;s <code>notAfter</code>
                time that cert-manager will begin to attempt to renew the certificate. If this value is greater than the total duration of the certificate (i.e. notAfter - notBefore), it will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>dnsNames</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>DNSNames is a list of DNS subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>ipAddresses</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>IPAddresses is a list of IP address subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>uriSANs</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>URISANs is a list of URI subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>emailSANs</code>
              <br />
              <em>[]string</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>EmailSANs is a list of email subjectAltNames to be set on the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>secretName</code>
              <br />
              <em>string</em>
            </td>
            <td>
              <p>SecretName is the name of the secret resource that will be automatically created and managed by this Certificate resource. It will be populated with a private key and certificate, signed by the denoted issuer.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>keystores</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1beta1.CertificateKeystores">CertificateKeystores</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>
                Keystores configures additional keystore output formats stored in the
                <code>secretName</code> Secret resource.
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p> IssuerRef is a reference to the issuer for this certificate. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> IsCA will mark this Certificate as valid for certificate signing. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1beta1.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>privateKey</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1beta1.CertificatePrivateKey">CertificatePrivateKey</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>Options to control private keys used for the Certificate.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>encodeUsagesInRequest</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>EncodeUsagesInRequest controls whether key usages should be present in the CertificateRequest</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.CertificateStatus">CertificateStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Status of the Certificate. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CertificateRequest">CertificateRequest</h3>
<div>
  <p>A CertificateRequest is used to request a signed certificate from one of the configured issuers.</p>
  <p>
    All fields within the CertificateRequest&rsquo;s <code>spec</code> are immutable after creation. A CertificateRequest will either succeed or fail, as denoted by its <code>status.state</code>
    field.
  </p>
  <p>A CertificateRequest is a one-shot resource, meaning it represents a single point in time request for a certificate and cannot be re-used.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1beta1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>CertificateRequest</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.CertificateRequestSpec">CertificateRequestSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the CertificateRequest resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>duration</code>
              <br />
              <em>
                <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p>The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>issuerRef</code>
              <br />
              <em>
                <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
              </em>
            </td>
            <td>
              <p> IssuerRef is a reference to the issuer for this CertificateRequest. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to <code>cert-manager.io</code> if empty. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>request</code>
              <br />
              <em>[]byte</em>
            </td>
            <td>
              <p>The PEM-encoded x509 certificate signing request to be submitted to the CA for signing.</p>
            </td>
          </tr>
          <tr>
            <td>
              <code>isCA</code>
              <br />
              <em>bool</em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> IsCA will request to mark the certificate as valid for certificate signing when submitting to the issuer. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
            </td>
          </tr>
          <tr>
            <td>
              <code>usages</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1beta1.KeyUsage">[]KeyUsage</a>
              </em>
            </td>
            <td>
              <em>(Optional)</em>
              <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.CertificateRequestStatus">CertificateRequestStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Status of the CertificateRequest. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.ClusterIssuer">ClusterIssuer</h3>
<div>
  <p> A ClusterIssuer represents a certificate issuing authority which can be referenced as part of <code>issuerRef</code> fields. It is similar to an Issuer, however it is cluster-scoped and therefore can be referenced by resources that exist in <em>any</em> namespace, not just the same namespace as the referent. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1beta1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>ClusterIssuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the ClusterIssuer resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1beta1.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Status of the ClusterIssuer. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.Issuer">Issuer</h3>
<div>
  <p> An Issuer represents a certificate issuing authority which can be referenced as part of <code>issuerRef</code> fields. It is scoped to a single namespace and can therefore only be referenced by resources within the same namespace. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>apiVersion</code>
        <br />
        string
      </td>
      <td>
        <code>cert-manager.io/v1beta1</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        string
      </td>
      <td>
        <code>Issuer</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>metadata</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#objectmeta-v1-meta">Kubernetes meta/v1.ObjectMeta</a>
        </em>
      </td>
      <td>
        Refer to the Kubernetes API documentation for the fields of the
        <code>metadata</code> field.
      </td>
    </tr>
    <tr>
      <td>
        <code>spec</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.IssuerSpec">IssuerSpec</a>
        </em>
      </td>
      <td>
        <p>Desired state of the Issuer resource.</p>
        <br />
        <br />
        <table>
          <tr>
            <td>
              <code>IssuerConfig</code>
              <br />
              <em>
                <a href="#cert-manager.io/v1beta1.IssuerConfig">IssuerConfig</a>
              </em>
            </td>
            <td>
              <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.IssuerStatus">IssuerStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Status of the Issuer. This is set and managed automatically.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CAIssuer">CAIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.IssuerConfig">IssuerConfig</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret used to sign Certificates issued by this Issuer.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>crlDistributionPoints</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The CRL distribution points is an X.509 v3 certificate extension which identifies the location of the CRL from which the revocation of this certificate can be checked. If not set, certificates will be issued without distribution points set.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ocspServers</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The OCSP server list is an X.509 v3 extension that defines a list of URLs of OCSP responders. The OCSP responders can be queried for the revocation status of an issued certificate. If not set, the certificate wil be issued with no OCSP servers set. For example, an OCSP server URL could be &ldquo;<a href='http://ocsp.int-x3.letsencrypt.org"'>http://ocsp.int-x3.letsencrypt.org&rdquo;</a>. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CertificateCondition">CertificateCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateStatus">CertificateStatus</a>) </p>
<div>
  <p>CertificateCondition contains condition information for an Certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.CertificateConditionType">CertificateConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>, <code>Issuing</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CertificateConditionType"> CertificateConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateCondition">CertificateCondition</a>) </p>
<div>
  <p>CertificateConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Issuing&#34;</p>
      </td>
      <td>
        <p>
          A condition added to Certificate resources when an issuance is required. This condition will be automatically added and set to true if: * No keypair data exists in the target Secret * The data stored in the Secret cannot be decoded * The private key and certificate do not have matching public keys * If a CertificateRequest for the current revision exists and the certificate data stored in the Secret does not match the
          <code>status.certificate</code> on the CertificateRequest. * If no CertificateRequest resource exists for the current revision, the options on the Certificate resource are compared against the x509 data in the Secret, similar to what&rsquo;s done in earlier versions. If there is a mismatch, an issuance is triggered. This condition may also be added by external API consumers to trigger a re-issuance manually for any other reason.
        </p>
        <p>It will be removed by the &lsquo;issuing&rsquo; controller upon completing issuance.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateConditionReady indicates that a certificate is ready for use. This is defined as: - The target secret exists - The target secret contains a certificate that has not expired - The target secret contains a private key valid for the certificate - The commonName and dnsNames attributes match those specified on the Certificate</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CertificateKeystores">CertificateKeystores</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>CertificateKeystores configures additional keystore output formats to be created in the Certificate&rsquo;s output Secret.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>jks</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.JKSKeystore">JKSKeystore</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          JKS configures options for storing a JKS keystore in the
          <code>spec.secretName</code> Secret resource.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>pkcs12</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.PKCS12Keystore">PKCS12Keystore</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          PKCS12 configures options for storing a PKCS12 keystore in the
          <code>spec.secretName</code> Secret resource.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CertificatePrivateKey">CertificatePrivateKey</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>CertificatePrivateKey contains configuration options for private keys used by the Certificate controller. This allows control of how private keys are rotated.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>rotationPolicy</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.PrivateKeyRotationPolicy">PrivateKeyRotationPolicy</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> RotationPolicy controls how private keys should be regenerated when a re-issuance is being processed. If set to Never, a private key will only be generated if one does not already exist in the target <code>spec.secretName</code>. If one does exists but it does not have the correct algorithm or size, a warning will be raised to await user intervention. If set to Always, a private key matching the specified requirements will be generated whenever a re-issuance occurs. Default is &lsquo;Never&rsquo; for backward compatibility. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>encoding</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.PrivateKeyEncoding">PrivateKeyEncoding</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The private key cryptography standards (PKCS) encoding for this certificate&rsquo;s private key to be encoded in. If provided, allowed values are <code>PKCS1</code> and <code>PKCS8</code> standing for PKCS#1 and PKCS#8, respectively. Defaults to <code>PKCS1</code> if not specified. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>algorithm</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.PrivateKeyAlgorithm">PrivateKeyAlgorithm</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Algorithm is the private key algorithm of the corresponding private key for this certificate. If provided, allowed values are either <code>RSA</code> or <code>ECDSA</code> If <code>algorithm</code> is specified and <code>size</code> is not provided, key size of 256 will be used for <code>ECDSA</code> key algorithm and key size of 2048 will be used for <code>RSA</code> key algorithm. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>size</code>
        <br />
        <em>int</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Size is the key bit size of the corresponding private key for this certificate. If <code>algorithm</code> is set to <code>RSA</code>, valid values are <code>2048</code>, <code>4096</code> or <code>8192</code>, and will default to <code>2048</code> if not specified. If <code>algorithm</code> is set to <code>ECDSA</code>, valid values are <code>256</code>, <code>384</code> or <code>521</code>, and will default to <code>256</code> if not specified. No other values are allowed. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CertificateRequestCondition">CertificateRequestCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateRequestStatus">CertificateRequestStatus</a>) </p>
<div>
  <p>CertificateRequestCondition contains condition information for a CertificateRequest.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.CertificateRequestConditionType">CertificateRequestConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>, <code>InvalidRequest</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CertificateRequestConditionType"> CertificateRequestConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateRequestCondition">CertificateRequestCondition</a>) </p>
<div>
  <p>CertificateRequestConditionType represents an Certificate condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;InvalidRequest&#34;</p>
      </td>
      <td>
        <p> CertificateRequestConditionInvalidRequest indicates that a certificate signer has refused to sign the request due to at least one of the input parameters being invalid. Additional information about why the request was rejected can be found in the <code>reason</code> and <code>message</code> fields. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p>CertificateRequestConditionReady indicates that a certificate is ready for use. This is defined as: - The target certificate exists in CertificateRequest.Status</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CertificateRequestSpec">CertificateRequestSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateRequestSpec defines the desired state of CertificateRequest</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p> IssuerRef is a reference to the issuer for this CertificateRequest. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the CertificateRequest will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. The group field refers to the API group of the issuer which defaults to <code>cert-manager.io</code> if empty. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>request</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <p>The PEM-encoded x509 certificate signing request to be submitted to the CA for signing.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> IsCA will request to mark the certificate as valid for certificate signing when submitting to the issuer. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CertificateRequestStatus">CertificateRequestStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateRequest">CertificateRequest</a>) </p>
<div>
  <p>CertificateRequestStatus defines the observed state of CertificateRequest and resulting signed certificate.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.CertificateRequestCondition">[]CertificateRequestCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of a CertificateRequest. Known condition types are <code>Ready</code> and <code>InvalidRequest</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>certificate</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The PEM encoded x509 certificate resulting from the certificate signing request. If not set, the CertificateRequest has either not been completed or has failed. More information on failure can be found by checking the
          <code>conditions</code> field.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The PEM encoded x509 certificate of the signer, also known as the CA (Certificate Authority). This is set on a best-effort basis by different issuers. If not set, the CA is assumed to be unknown/not available.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>failureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>FailureTime stores the time that this CertificateRequest failed. This is used to influence garbage collection and back-off.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CertificateSpec">CertificateSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateSpec defines the desired state of Certificate. A valid Certificate requires at least one of a CommonName, DNSName, or URISAN to be valid.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>subject</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.X509Subject">X509Subject</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Full X509 name specification (<a href="https://golang.org/pkg/crypto/x509/pkix/#Name">https://golang.org/pkg/crypto/x509/pkix/#Name</a>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>commonName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> CommonName is a common name to be used on the Certificate. The CommonName should have a length of 64 characters or fewer to avoid generating invalid CSRs. This value is ignored by TLS clients when any subject alt name is set. This is x509 behaviour: <a href="https://tools.ietf.org/html/rfc6125#section-6.4.4">https://tools.ietf.org/html/rfc6125#section-6.4.4</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>duration</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The requested &lsquo;duration&rsquo; (i.e. lifetime) of the Certificate. This option may be ignored/overridden by some issuer types. If overridden and <code>renewBefore</code> is greater than the actual certificate duration, the certificate will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>renewBefore</code>
        <br />
        <em>
          <a href="https://godoc.org/k8s.io/apimachinery/pkg/apis/meta/v1#Duration">Kubernetes meta/v1.Duration</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The amount of time before the currently issued certificate&rsquo;s <code>notAfter</code>
          time that cert-manager will begin to attempt to renew the certificate. If this value is greater than the total duration of the certificate (i.e. notAfter - notBefore), it will be automatically renewed 2/3rds of the way through the certificate&rsquo;s duration.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>dnsNames</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>DNSNames is a list of DNS subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ipAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>IPAddresses is a list of IP address subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>uriSANs</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>URISANs is a list of URI subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>emailSANs</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>EmailSANs is a list of email subjectAltNames to be set on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>SecretName is the name of the secret resource that will be automatically created and managed by this Certificate resource. It will be populated with a private key and certificate, signed by the denoted issuer.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>keystores</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.CertificateKeystores">CertificateKeystores</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          Keystores configures additional keystore output formats stored in the
          <code>secretName</code> Secret resource.
        </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>issuerRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ObjectReference">ObjectReference</a>
        </em>
      </td>
      <td>
        <p> IssuerRef is a reference to the issuer for this certificate. If the <code>kind</code> field is not set, or set to <code>Issuer</code>, an Issuer resource with the given name in the same namespace as the Certificate will be used. If the <code>kind</code> field is set to <code>ClusterIssuer</code>, a ClusterIssuer with the provided name will be used. The <code>name</code> field in this stanza is required at all times. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>isCA</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> IsCA will mark this Certificate as valid for certificate signing. This will automatically add the <code>cert sign</code> usage to the list of <code>usages</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>usages</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.KeyUsage">[]KeyUsage</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Usages is the set of x509 usages that are requested for the certificate. Defaults to <code>digital signature</code> and <code>key encipherment</code> if not specified. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>privateKey</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.CertificatePrivateKey">CertificatePrivateKey</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Options to control private keys used for the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>encodeUsagesInRequest</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>EncodeUsagesInRequest controls whether key usages should be present in the CertificateRequest</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.CertificateStatus">CertificateStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.Certificate">Certificate</a>) </p>
<div>
  <p>CertificateStatus defines the observed state of Certificate</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.CertificateCondition">[]CertificateCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of certificates. Known condition types are <code>Ready</code> and <code>Issuing</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastFailureTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastFailureTime is the time as recorded by the Certificate controller of the most recent failure to complete a CertificateRequest for this Certificate resource. If set, cert-manager will not re-request another Certificate until 1 hour has elapsed from this time.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>notBefore</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The time after which the certificate stored in the secret named by this resource in spec.secretName is valid.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>notAfter</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The expiration time of the certificate stored in the secret named by this resource in <code>spec.secretName</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>renewalTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>RenewalTime is the time at which the certificate will be next renewed. If not set, no upcoming renewal is scheduled.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>revision</code>
        <br />
        <em>int</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The current &lsquo;revision&rsquo; of the certificate as issued.</p>
        <p>
          When a CertificateRequest resource is created, it will have the
          <code>cert-manager.io/certificate-revision</code> set to one greater than the current value of this field.
        </p>
        <p>Upon issuance, this field will be set to the value of the annotation on the CertificateRequest resource used to issue the certificate.</p>
        <p>Persisting the value on the CertificateRequest resource allows the certificates controller to know whether a request is part of an old issuance or if it is part of the ongoing revision&rsquo;s issuance by checking if the revision value in the annotation is greater than this field.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>nextPrivateKeySecretName</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>
          The name of the Secret resource containing the private key to be used for the next certificate iteration. The keymanager controller will automatically set this field if the
          <code>Issuing</code> condition is set to <code>True</code>. It will automatically unset this field when the Issuing condition is not set or False.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.IssuerCondition">IssuerCondition</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.IssuerStatus">IssuerStatus</a>) </p>
<div>
  <p>IssuerCondition contains condition information for an Issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>type</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.IssuerConditionType">IssuerConditionType</a>
        </em>
      </td>
      <td>
        <p> Type of the condition, known values are (<code>Ready</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>status</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.ConditionStatus">ConditionStatus</a>
        </em>
      </td>
      <td>
        <p> Status of the condition, one of (<code>True</code>, <code>False</code>, <code>Unknown</code>). </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastTransitionTime</code>
        <br />
        <em>
          <a href="https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.19/#time-v1-meta">Kubernetes meta/v1.Time</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>LastTransitionTime is the timestamp corresponding to the last status change of this condition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>reason</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Reason is a brief machine readable explanation for the condition&rsquo;s last transition.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>message</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Message is a human readable description of the details of the last transition, complementing reason.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.IssuerConditionType"> IssuerConditionType (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.IssuerCondition">IssuerCondition</a>) </p>
<div>
  <p>IssuerConditionType represents an Issuer condition value.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;Ready&#34;</p>
      </td>
      <td>
        <p> IssuerConditionReady represents the fact that a given Issuer condition is in ready state and able to issue certificates. If the <code>status</code> of this condition is <code>False</code>, CertificateRequest controllers should prevent attempts to sign certificates. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.IssuerConfig">IssuerConfig</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.IssuerSpec">IssuerSpec</a>) </p>
<div>
  <p>The configuration for the issuer. Only one of these can be set.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEIssuer">ACMEIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ACME configures this issuer to communicate with a RFC8555 (ACME) server to obtain signed x509 certificates.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>ca</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.CAIssuer">CAIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CA configures this issuer to sign certificates using a signing CA keypair stored in a Secret resource. This is used to build internal PKIs that are managed by cert-manager.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>vault</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.VaultIssuer">VaultIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Vault configures this issuer to sign certificates using a HashiCorp Vault PKI backend.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>selfSigned</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.SelfSignedIssuer">SelfSignedIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>SelfSigned configures this issuer to &lsquo;self sign&rsquo; certificates using the private key used to create the CertificateRequest object.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>venafi</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.VenafiIssuer">VenafiIssuer</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Venafi configures this issuer to sign certificates using a Venafi TPP or Venafi Cloud policy zone.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.IssuerSpec">IssuerSpec</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1beta1.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerSpec is the specification of an Issuer. This includes any configuration required for the issuer.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>IssuerConfig</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.IssuerConfig">IssuerConfig</a>
        </em>
      </td>
      <td>
        <p> (Members of <code>IssuerConfig</code> are embedded into this type.) </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.IssuerStatus">IssuerStatus</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.ClusterIssuer">ClusterIssuer</a>, <a href="#cert-manager.io/v1beta1.Issuer">Issuer</a>) </p>
<div>
  <p>IssuerStatus contains status information about an Issuer</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>conditions</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.IssuerCondition">[]IssuerCondition</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> List of status conditions to indicate the status of a CertificateRequest. Known condition types are <code>Ready</code>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>acme</code>
        <br />
        <em>
          <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerStatus">ACMEIssuerStatus</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>ACME specific status options. This field should only be set if the Issuer is configured to use an ACME server to issue certificates.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.JKSKeystore">JKSKeystore</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateKeystores">CertificateKeystores</a>) </p>
<div>
  <p>
    JKS configures options for storing a JKS keystore in the <code>spec.secretName</code>
    Secret resource.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>create</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <p> Create enables JKS keystore creation for the Certificate. If true, a file named <code>keystore.jks</code> will be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code>. The keystore file will only be updated upon re-issuance. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>passwordSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>PasswordSecretRef is a reference to a key in a Secret resource containing the password used to encrypt the JKS keystore.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.KeyUsage"> KeyUsage (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateRequestSpec">CertificateRequestSpec</a>, <a href="#cert-manager.io/v1beta1.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>
    KeyUsage specifies valid usage contexts for keys. See: <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.3">https://tools.ietf.org/html/rfc5280#section-4.2.1.3</a>
    <a href="https://tools.ietf.org/html/rfc5280#section-4.2.1.12">https://tools.ietf.org/html/rfc5280#section-4.2.1.12</a>
    Valid KeyUsage values are as follows: &ldquo;signing&rdquo;, &ldquo;digital signature&rdquo;, &ldquo;content commitment&rdquo;, &ldquo;key encipherment&rdquo;, &ldquo;key agreement&rdquo;, &ldquo;data encipherment&rdquo;, &ldquo;cert sign&rdquo;, &ldquo;crl sign&rdquo;, &ldquo;encipher only&rdquo;, &ldquo;decipher only&rdquo;, &ldquo;any&rdquo;, &ldquo;server auth&rdquo;, &ldquo;client auth&rdquo;, &ldquo;code signing&rdquo;, &ldquo;email protection&rdquo;, &ldquo;s/mime&rdquo;, &ldquo;ipsec end system&rdquo;, &ldquo;ipsec tunnel&rdquo;, &ldquo;ipsec user&rdquo;, &ldquo;timestamping&rdquo;, &ldquo;ocsp signing&rdquo;, &ldquo;microsoft sgc&rdquo;, &ldquo;netscape sgc&rdquo;
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;any&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;crl sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;cert sign&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;client auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;code signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;content commitment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;data encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;decipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;digital signature&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;email protection&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;encipher only&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec end system&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec tunnel&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ipsec user&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key agreement&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;key encipherment&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;microsoft sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;netscape sgc&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;ocsp signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;s/mime&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;server auth&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;signing&#34;</p>
      </td>
      <td></td>
    </tr>
    <tr>
      <td>
        <p>&#34;timestamping&#34;</p>
      </td>
      <td></td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.PKCS12Keystore">PKCS12Keystore</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateKeystores">CertificateKeystores</a>) </p>
<div>
  <p>
    PKCS12 configures options for storing a PKCS12 keystore in the
    <code>spec.secretName</code> Secret resource.
  </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>create</code>
        <br />
        <em>bool</em>
      </td>
      <td>
        <p> Create enables PKCS12 keystore creation for the Certificate. If true, a file named <code>keystore.p12</code> will be created in the target Secret resource, encrypted using the password stored in <code>passwordSecretRef</code>. The keystore file will only be updated upon re-issuance. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>passwordSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>PasswordSecretRef is a reference to a key in a Secret resource containing the password used to encrypt the PKCS12 keystore.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.PrivateKeyAlgorithm"> PrivateKeyAlgorithm (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificatePrivateKey">CertificatePrivateKey</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;ECDSA&#34;</p>
      </td>
      <td>
        <p>Denotes the ECDSA private key type.</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;RSA&#34;</p>
      </td>
      <td>
        <p>Denotes the RSA private key type.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.PrivateKeyEncoding"> PrivateKeyEncoding (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificatePrivateKey">CertificatePrivateKey</a>) </p>
<div></div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;PKCS1&#34;</p>
      </td>
      <td>
        <p> PKCS1 key encoding will produce PEM files that include the type of private key as part of the PEM header, e.g. <code>BEGIN RSA PRIVATE KEY</code>. If the keyAlgorithm is set to &lsquo;ECDSA&rsquo;, this will produce private keys that use the <code>BEGIN EC PRIVATE KEY</code> header. </p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;PKCS8&#34;</p>
      </td>
      <td>
        <p>
          PKCS8 key encoding will produce PEM files with the <code>BEGIN PRIVATE KEY</code>
          header. It encodes the keyAlgorithm of the private key as part of the DER encoded PEM block.
        </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.PrivateKeyRotationPolicy"> PrivateKeyRotationPolicy (<code>string</code> alias) </h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificatePrivateKey">CertificatePrivateKey</a>) </p>
<div>
  <p>Denotes how private keys should be generated or sourced when a Certificate is being issued.</p>
</div>
<h3 id="cert-manager.io/v1beta1.SelfSignedIssuer">SelfSignedIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to &lsquo;self sign&rsquo; certificates using the private key used to create the CertificateRequest object.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>crlDistributionPoints</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>The CRL distribution points is an X.509 v3 certificate extension which identifies the location of the CRL from which the revocation of this certificate can be checked. If not set certificate will be issued without CDP. Values are strings.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.VaultAppRole">VaultAppRole</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.VaultAuth">VaultAuth</a>) </p>
<div>
  <p>VaultAppRole authenticates with Vault using the App Role auth mechanism, with the role and secret stored in a Kubernetes Secret resource.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Path where the App Role authentication backend is mounted in Vault, e.g: &ldquo;approle&rdquo;</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>roleId</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>RoleID configured in the App Role authentication backend when setting up the authentication backend in Vault.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p> Reference to a key in a Secret that contains the App Role secret used to authenticate with Vault. The <code>key</code> field must be specified and denotes which entry within the Secret resource is used as the app role secret. </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.VaultAuth">VaultAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.VaultIssuer">VaultIssuer</a>) </p>
<div>
  <p> Configuration used to authenticate with a Vault server. Only one of <code>tokenSecretRef</code>, <code>appRole</code> or <code>kubernetes</code> may be specified. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>tokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>TokenSecretRef authenticates with Vault by presenting a token.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>appRole</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.VaultAppRole">VaultAppRole</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>AppRole authenticates with Vault using the App Role auth mechanism, with the role and secret stored in a Kubernetes Secret resource.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>kubernetes</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.VaultKubernetesAuth">VaultKubernetesAuth</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Kubernetes authenticates with Vault by passing the ServiceAccount token stored in the named Secret resource to the Vault server.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.VaultIssuer">VaultIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to sign certificates using a HashiCorp Vault PKI backend.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>auth</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.VaultAuth">VaultAuth</a>
        </em>
      </td>
      <td>
        <p>Auth configures how cert-manager authenticates with the Vault server.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>server</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Server is the connection address for the Vault server, e.g: &ldquo;<a href='https://vault.example.com:8200"'>https://vault.example.com:8200&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>path</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Path is the mount path of the Vault PKI backend&rsquo;s <code>sign</code> endpoint, e.g: &ldquo;my_pki_mount/sign/my-role-name&rdquo;. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>namespace</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> Name of the vault namespace. Namespaces is a set of features within Vault Enterprise that allows Vault environments to support Secure Multi-tenancy. e.g: &ldquo;ns1&rdquo; More about namespaces can be found here <a href="https://www.vaultproject.io/docs/enterprise/namespaces">https://www.vaultproject.io/docs/enterprise/namespaces</a> </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>PEM encoded CA bundle used to validate Vault server certificate. Only used if the Server URL is using HTTPS protocol. This parameter is ignored for plain HTTP protocol connection. If not set the system root certificates are used to validate the TLS connection.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.VaultKubernetesAuth">VaultKubernetesAuth</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.VaultAuth">VaultAuth</a>) </p>
<div>
  <p>Authenticate against Vault using a Kubernetes ServiceAccount token stored in a Secret.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>mountPath</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The Vault mountPath here is the mount path to use when authenticating with Vault. For example, setting a value to <code>/v1/auth/foo</code>, will use the path <code>/v1/auth/foo/login</code> to authenticate with Vault. If unspecified, the default value &ldquo;/v1/auth/kubernetes&rdquo; will be used. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>secretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>The required Secret field containing a Kubernetes ServiceAccount JWT used for authenticating with Vault. Use of &lsquo;ambient credentials&rsquo; is not supported.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>role</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>A required field containing the Vault Role to assume. A Role binds a Kubernetes ServiceAccount with a set of Vault policies.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.VenafiCloud">VenafiCloud</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiCloud defines connection configuration details for Venafi Cloud</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> URL is the base URL for Venafi Cloud. Defaults to &ldquo;<a href='https://api.venafi.cloud/v1"'>https://api.venafi.cloud/v1&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>apiTokenSecretRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>
        </em>
      </td>
      <td>
        <p>APITokenSecretRef is a secret key selector for the Venafi Cloud API token.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.VenafiIssuer">VenafiIssuer</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.IssuerConfig">IssuerConfig</a>) </p>
<div>
  <p>Configures an issuer to sign certificates using a Venafi TPP or Cloud policy zone.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>zone</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Zone is the Venafi Policy Zone to use for this issuer. All requests made to the Venafi platform will be restricted by the named zone policy. This field is required.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>tpp</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.VenafiTPP">VenafiTPP</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>TPP specifies Trust Protection Platform configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>cloud</code>
        <br />
        <em>
          <a href="#cert-manager.io/v1beta1.VenafiCloud">VenafiCloud</a>
        </em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cloud specifies the Venafi cloud configuration settings. Only one of TPP or Cloud may be specified.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.VenafiTPP">VenafiTPP</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.VenafiIssuer">VenafiIssuer</a>) </p>
<div>
  <p>VenafiTPP defines connection configuration details for a Venafi TPP instance</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>url</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> URL is the base URL for the vedsdk endpoint of the Venafi TPP instance, for example: &ldquo;<a href='https://tpp.example.com/vedsdk"'>https://tpp.example.com/vedsdk&rdquo;</a>. </p>
      </td>
    </tr>
    <tr>
      <td>
        <code>credentialsRef</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.LocalObjectReference">LocalObjectReference</a>
        </em>
      </td>
      <td>
        <p>CredentialsRef is a reference to a Secret containing the username and password for the TPP server. The secret must contain two keys, &lsquo;username&rsquo; and &lsquo;password&rsquo;.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>caBundle</code>
        <br />
        <em>[]byte</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>CABundle is a PEM encoded TLS certificate to use to verify connections to the TPP instance. If specified, system roots will not be used and the issuing CA for the TPP instance must be verifiable using the provided root. If not specified, the connection will be verified using the cert-manager system root certificates.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="cert-manager.io/v1beta1.X509Subject">X509Subject</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1beta1.CertificateSpec">CertificateSpec</a>) </p>
<div>
  <p>X509Subject Full X509 name specification</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>organizations</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organizations to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>countries</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Countries to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>organizationalUnits</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Organizational Units to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>localities</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Cities to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>provinces</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>State/Provinces to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>streetAddresses</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Street addresses to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>postalCodes</code>
        <br />
        <em>[]string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Postal codes to be used on the Certificate.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>serialNumber</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Serial number to be used on the Certificate.</p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<h2 id="meta.cert-manager.io/v1">meta.cert-manager.io/v1</h2>
<div>
  <p>Package meta contains meta types for cert-manager APIs</p>
</div>
Resource Types:
<ul></ul>
<h3 id="meta.cert-manager.io/v1.ConditionStatus"> ConditionStatus (<code>string</code> alias) </h3>
<p>
  (<em>Appears on:</em> <a href="#cert-manager.io/v1.CertificateCondition">CertificateCondition</a>, <a href="#cert-manager.io/v1.CertificateRequestCondition">CertificateRequestCondition</a>, <a href="#cert-manager.io/v1.IssuerCondition">IssuerCondition</a>, <a href="#cert-manager.io/v1alpha2.CertificateCondition">CertificateCondition</a>, <a href="#cert-manager.io/v1alpha2.CertificateRequestCondition">CertificateRequestCondition</a>, <a href="#cert-manager.io/v1alpha2.IssuerCondition">IssuerCondition</a>, <a href="#cert-manager.io/v1alpha3.CertificateCondition">CertificateCondition</a>, <a href="#cert-manager.io/v1alpha3.CertificateRequestCondition">CertificateRequestCondition</a>, <a href="#cert-manager.io/v1alpha3.IssuerCondition">IssuerCondition</a>, <a href="#cert-manager.io/v1beta1.CertificateCondition">CertificateCondition</a>, <a href="#cert-manager.io/v1beta1.CertificateRequestCondition">CertificateRequestCondition</a>,
  <a href="#cert-manager.io/v1beta1.IssuerCondition">IssuerCondition</a>)
</p>
<div>
  <p>ConditionStatus represents a condition&rsquo;s status.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Value</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>&#34;False&#34;</p>
      </td>
      <td>
        <p>ConditionFalse represents the fact that a given condition is false</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;True&#34;</p>
      </td>
      <td>
        <p>ConditionTrue represents the fact that a given condition is true</p>
      </td>
    </tr>
    <tr>
      <td>
        <p>&#34;Unknown&#34;</p>
      </td>
      <td>
        <p>ConditionUnknown represents the fact that a given condition is unknown</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="meta.cert-manager.io/v1.LocalObjectReference">LocalObjectReference</h3>
<p> (<em>Appears on:</em> <a href="#cert-manager.io/v1.VenafiTPP">VenafiTPP</a>, <a href="#cert-manager.io/v1alpha2.VenafiTPP">VenafiTPP</a>, <a href="#cert-manager.io/v1alpha3.VenafiTPP">VenafiTPP</a>, <a href="#cert-manager.io/v1beta1.VenafiTPP">VenafiTPP</a>, <a href="#meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</a>) </p>
<div>
  <p>A reference to an object in the same namespace as the referent. If the referent is a cluster-scoped resource (e.g. a ClusterIssuer), the reference instead refers to the resource with the given name in the configured &lsquo;cluster resource namespace&rsquo;, which is set as a flag on the controller component (and defaults to the namespace that cert-manager runs in).</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>name</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p> Name of the resource being referred to. More info: <a href="https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names">https://kubernetes.io/docs/concepts/overview/working-with-objects/names/#names</a> </p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="meta.cert-manager.io/v1.ObjectReference">ObjectReference</h3>
<p>
  (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ChallengeSpec">ChallengeSpec</a>, <a href="#acme.cert-manager.io/v1.OrderSpec">OrderSpec</a>, <a href="#acme.cert-manager.io/v1alpha2.ChallengeSpec">ChallengeSpec</a>, <a href="#acme.cert-manager.io/v1alpha2.OrderSpec">OrderSpec</a>, <a href="#acme.cert-manager.io/v1alpha3.ChallengeSpec">ChallengeSpec</a>, <a href="#acme.cert-manager.io/v1alpha3.OrderSpec">OrderSpec</a>, <a href="#acme.cert-manager.io/v1beta1.ChallengeSpec">ChallengeSpec</a>, <a href="#acme.cert-manager.io/v1beta1.OrderSpec">OrderSpec</a>, <a href="#cert-manager.io/v1.CertificateRequestSpec">CertificateRequestSpec</a>, <a href="#cert-manager.io/v1.CertificateSpec">CertificateSpec</a>, <a href="#cert-manager.io/v1alpha2.CertificateRequestSpec">CertificateRequestSpec</a>, <a href="#cert-manager.io/v1alpha2.CertificateSpec">CertificateSpec</a>, <a href="#cert-manager.io/v1alpha3.CertificateRequestSpec">CertificateRequestSpec</a>,
  <a href="#cert-manager.io/v1alpha3.CertificateSpec">CertificateSpec</a>, <a href="#cert-manager.io/v1beta1.CertificateRequestSpec">CertificateRequestSpec</a>, <a href="#cert-manager.io/v1beta1.CertificateSpec">CertificateSpec</a>)
</p>
<div>
  <p>ObjectReference is a reference to an object with a given name, kind and group.</p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>name</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <p>Name of the resource being referred to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>kind</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Kind of the resource being referred to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>group</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p>Group of the resource being referred to.</p>
      </td>
    </tr>
  </tbody>
</table>
<h3 id="meta.cert-manager.io/v1.SecretKeySelector">SecretKeySelector</h3>
<p>
  (<em>Appears on:</em> <a href="#acme.cert-manager.io/v1.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>, <a href="#acme.cert-manager.io/v1.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>, <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>, <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>, <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>, <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>, <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>, <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>,
  <a href="#acme.cert-manager.io/v1.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>,
  <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>, <a href="#acme.cert-manager.io/v1alpha2.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>,
  <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>, <a href="#acme.cert-manager.io/v1alpha3.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>, <a href="#acme.cert-manager.io/v1beta1.ACMEExternalAccountBinding">ACMEExternalAccountBinding</a>, <a href="#acme.cert-manager.io/v1beta1.ACMEIssuer">ACMEIssuer</a>, <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderAcmeDNS">ACMEIssuerDNS01ProviderAcmeDNS</a>, <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderAkamai">ACMEIssuerDNS01ProviderAkamai</a>, <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderAzureDNS">ACMEIssuerDNS01ProviderAzureDNS</a>, <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderCloudDNS">ACMEIssuerDNS01ProviderCloudDNS</a>,
  <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderCloudflare">ACMEIssuerDNS01ProviderCloudflare</a>, <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderDigitalOcean">ACMEIssuerDNS01ProviderDigitalOcean</a>, <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderRFC2136">ACMEIssuerDNS01ProviderRFC2136</a>, <a href="#acme.cert-manager.io/v1beta1.ACMEIssuerDNS01ProviderRoute53">ACMEIssuerDNS01ProviderRoute53</a>, <a href="#cert-manager.io/v1.JKSKeystore">JKSKeystore</a>, <a href="#cert-manager.io/v1.PKCS12Keystore">PKCS12Keystore</a>, <a href="#cert-manager.io/v1.VaultAppRole">VaultAppRole</a>, <a href="#cert-manager.io/v1.VaultAuth">VaultAuth</a>, <a href="#cert-manager.io/v1.VaultKubernetesAuth">VaultKubernetesAuth</a>, <a href="#cert-manager.io/v1.VenafiCloud">VenafiCloud</a>, <a href="#cert-manager.io/v1alpha2.JKSKeystore">JKSKeystore</a>, <a href="#cert-manager.io/v1alpha2.PKCS12Keystore">PKCS12Keystore</a>,
  <a href="#cert-manager.io/v1alpha2.VaultAppRole">VaultAppRole</a>, <a href="#cert-manager.io/v1alpha2.VaultAuth">VaultAuth</a>, <a href="#cert-manager.io/v1alpha2.VaultKubernetesAuth">VaultKubernetesAuth</a>, <a href="#cert-manager.io/v1alpha2.VenafiCloud">VenafiCloud</a>, <a href="#cert-manager.io/v1alpha3.JKSKeystore">JKSKeystore</a>, <a href="#cert-manager.io/v1alpha3.PKCS12Keystore">PKCS12Keystore</a>, <a href="#cert-manager.io/v1alpha3.VaultAppRole">VaultAppRole</a>, <a href="#cert-manager.io/v1alpha3.VaultAuth">VaultAuth</a>, <a href="#cert-manager.io/v1alpha3.VaultKubernetesAuth">VaultKubernetesAuth</a>, <a href="#cert-manager.io/v1alpha3.VenafiCloud">VenafiCloud</a>, <a href="#cert-manager.io/v1beta1.JKSKeystore">JKSKeystore</a>, <a href="#cert-manager.io/v1beta1.PKCS12Keystore">PKCS12Keystore</a>, <a href="#cert-manager.io/v1beta1.VaultAppRole">VaultAppRole</a>, <a href="#cert-manager.io/v1beta1.VaultAuth">VaultAuth</a>,
  <a href="#cert-manager.io/v1beta1.VaultKubernetesAuth">VaultKubernetesAuth</a>, <a href="#cert-manager.io/v1beta1.VenafiCloud">VenafiCloud</a>)
</p>
<div>
  <p> A reference to a specific &lsquo;key&rsquo; within a Secret resource. In some instances, <code>key</code> is a required field. </p>
</div>
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>LocalObjectReference</code>
        <br />
        <em>
          <a href="#meta.cert-manager.io/v1.LocalObjectReference">LocalObjectReference</a>
        </em>
      </td>
      <td>
        <p> (Members of <code>LocalObjectReference</code> are embedded into this type.) </p>
        <p>The name of the Secret resource being referred to.</p>
      </td>
    </tr>
    <tr>
      <td>
        <code>key</code>
        <br />
        <em>string</em>
      </td>
      <td>
        <em>(Optional)</em>
        <p> The key of the entry in the Secret resource&rsquo;s <code>data</code> field to be used. Some instances of this field may be defaulted, in others it may be required. </p>
      </td>
    </tr>
  </tbody>
</table>
<hr />
<p>
  <em> Generated with <code>gen-crd-api-reference-docs</code> on git commit <code>969b678f3</code>. </em>
</p>