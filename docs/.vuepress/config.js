module.exports = {
  themeConfig: {
    lastUpdated: 'Last updated',
    // displayAllHeaders: true,
    sidebar: [
      '/',
      {
        title: 'Getting Started',
        path: '/getting-started',
        collapsable: false, // optional, defaults to true
        children: [
          'getting-started/setting-up-your-environment',
          'getting-started/creating-your-first-project'
        ]
      },
      {
        title: 'Core Concepts',
        path: '/core-concepts',
        collapsable: false,
        children: [
          'core-concepts/technical-overview',
          {
            title: 'Pages and Navigation',
            path: '/core-concepts/pages-and-navigation',
            children: [
              'core-concepts/pages-and-navigation/page-templates',
              'core-concepts/pages-and-navigation/widgets-singletons-and-areas',
              'core-concepts/pages-and-navigation/connecting-pages'
            ]
          },
          {
            title: 'Widgets',
            path: '/core-concepts/editable-content-on-pages',
            children: [
              'core-concepts/editable-content-on-pages/standard-widgets',
              'core-concepts/editable-content-on-pages/custom-widgets',
              'core-concepts/editable-content-on-pages/layout-widgets'
            ]
          },
          {
            title: 'Pieces',
            path: '/core-concepts/reusable-content-pieces',
            children: [
              'core-concepts/reusable-content-pieces/reusable-content-with-pieces',
              'core-concepts/reusable-content-pieces/displaying-pieces-with-widgets',
              'core-concepts/reusable-content-pieces/browsing-directory-of-pieces',
              'core-concepts/reusable-content-pieces/joins'
            ]
          },
          {
            title: 'Global settings',
            path: '/core-concepts/global-settings',
            children: [
              'core-concepts/global-settings/settings',
              'core-concepts/global-settings/global'
            ]
          },
          {
            title: 'Modules',
            path: '/core-concepts/modules',
            children: [
              'core-concepts/modules/how-apostrophe-modules-are-structured',
              'core-concepts/modules/nested-module-folders',
              'core-concepts/modules/more-modules'
            ]
          },
          {
            title: 'Front End Assets',
            path: '/core-concepts/front-end-assets',
            children: [
              'core-concepts/front-end-assets/pushing-assets',
              'core-concepts/front-end-assets/lean-frontend-assets'
            ]
          },
          {
            title: 'Users and Permission',
            path: '/core-concepts/users-and-permissions',
            children: [
              'core-concepts/users-and-permissions/users-and-groups',
              'core-concepts/users-and-permissions/managing-access-control',
              'core-concepts/users-and-permissions/apostrophe-passport',
              'core-concepts/users-and-permissions/user-login-and-password'
            ]
          },
          {
            title: 'Working with Templates',
            path: '/core-concepts/working-with-templates',
            children: [
              'core-concepts/working-with-templates/nunjucks-filters',
              'core-concepts/working-with-templates/nunjucks-helper-functions',
              'core-concepts/working-with-templates/thumbnails-and-areas-of-child-pages',
              'core-concepts/working-with-templates/responsive-images'
            ]
          },
          {
            title: 'Search',
            path: '/core-concepts/apostrophe-search',
            children: [
              'core-concepts/apostrophe-search/search'
            ]
          }
        ]
      }

      // ## Advanced Topics

      // * [Schema Guide](schema-guide/schema-guide.md)
      // * [Advanced Pieces Topics](advanced-development/advanced-pieces-topics/README.md)
      //   * [AJAX Features: Enhanced Browsing for Pieces](advanced-development/advanced-pieces-topics/ajax-pieces.md)
      //   * [Fine-grained Permissions for Pieces](advanced-development/advanced-pieces-topics/permissions-for-pieces.md)
      //   * [Adding Filters](advanced-development/advanced-pieces-topics/adding-filters.md)
      //   * [Adding Columns](advanced-development/advanced-pieces-topics/adding-columns.md)
      //   * [Next and Previous Links](advanced-development/advanced-pieces-topics/next-previous-links.md)
      //   * [Suppressing Pieces from a Listing](advanced-topics/advanced-pieces-topics/suppressing-pieces-from-a-listing.md)
      //   * [Adding Fields to All Pieces](advanced-development/advanced-pieces-topics/adding-fields-to-all-pieces.md)
      //   * [Adding new batch operations for pieces](advanced-development/advanced-pieces-topics/adding-new-batch-operations.md)
      //   * [Extending the Pieces Editor Modal](advanced-development/advanced-pieces-topics/extending-the-pieces-editor-modal.md)
      //   * [Understanding and Overriding Piece URLs](advanced-development/advanced-pieces-topics/overriding-piece-urls.md)
      // * [Advanced Pages Topics](advanced-development/advanced-pages-topics/README.md)
      //   * [Custom Schemas for Pages](advanced-development/advanced-pages-topics/custom-schema-fields-for-pages.md)
      //   * [Accessing the children of pages via joins](advanced-development/advanced-pages-topics/children-and-joins.md)
      // * [How Apostrophe Handles Requests](advanced-development/how-apostrophe-handles-requests.md)
      // * [How Apostrophe Starts Up](advanced-development/how-apostrophe-starts-up.md)
      // * [Custom Server-side Event Handlers with Promise Events](advanced-development/promise-events/README.md)
      //   * [Custom Server-side Event Handlers with Promise Events](advanced-development/promise-events/promise-events.md)
      // * [Command line tasks](advanced-development/apostrophe-cli/command-line-tasks.md)
      // * [Internationalization and localization](advanced-development/internationalization-localization/apostrophe-i18n-config.md)
      // * [The Database](advanced-development/database/README.md)
      //   * [Apostrophe's model layer: working with the database](advanced-development/database/model-layer.md)
      //   * [Working with cursors](advanced-development/database/cursors.md)
      //   * [Accessing the database directly](advanced-development/database/accessing-the-database-directly.md)
      //   * [Using MongoDB replica sets with Apostrophe](advanced-development/database/replica-set.md)

      // ## Apostrophe DevOps

      // * [Apostrophe DevOps](devops/README.md)
      //   * [Hosting Apostrophe in production](devops/deployment/README.md)
      //     * [Hosting Apostrophe in production](devops/deployment/deployment.md)
      //     * [Deploying Apostrophe to a Linode linux server quickly](devops/deployment/linode.md)
      //     * [Deploying Apostrophe in the Cloud with Heroku](devops/deployment/deploying-apostrophe-in-the-cloud-with-heroku.md)
      //     * [Deploying Apostrophe with AWS and Elastic Beanstalk](devops/deployment/deploying-apostrophe-in-the-cloud-with-aws.md)
      //   * [Storing Images and Files in the Cloud](devops/cloud/README.md)
      //     * [Storing images and files in Amazon S3](devops/cloud/storing-images-and-files-in-amazon-s3.md)
      //     * [Storing images and files in Azure Blob Storage](devops/cloud/storing-images-and-files-in-azure-blob-storage.md)
      //     * [Storing images and files in Google Cloud Storage](devops/cloud/storing-images-and-files-in-google-cloud-storage.md)
      //   * [Sending email from your ApostropheCMS site](devops/email.md)
      //   * [Storing Sessions in Redis](devops/storing-sessions-in-redis.md)
      //   * [Running Apostrophe on multiple cores and/or servers](devops/multicore.md)
      //   * [Running Apostrophe on Windows](devops/windows.md)
      //   * [Building Docker images for Apostrophe projects](devops/docker.md)
      //   * [Apostrophe Migration Guide](devops/migration.md)

      // ## HOWTOs

      // * [Apostrophe HOWTOs](howtos/README.md)
      // * [Hosting Apostrophe in production](devops/deployment/README.md)
      //   * [Hosting Apostrophe in production](devops/deployment/deployment.md)
      //   * [Deploying Apostrophe to a Linode linux server quickly](devops/deployment/linode.md)
      //   * [Deploying Apostrophe in the Cloud with Heroku](devops/deployment/deploying-apostrophe-in-the-cloud-with-heroku.md)
      //   * [Deploying Apostrophe with AWS and Elastic Beanstalk](devops/deployment/deploying-apostrophe-in-the-cloud-with-aws.md)
      // * [Storing Images and Files in the Cloud](devops/cloud/README.md)
      //   * [Storing images and files in Amazon S3](devops/cloud/storing-images-and-files-in-amazon-s3.md)
      //   * [Storing images and files in Azure Blob Storage](devops/cloud/storing-images-and-files-in-azure-blob-storage.md)
      //   * [Storing images and files in Google Cloud Storage](devops/cloud/storing-images-and-files-in-google-cloud-storage.md)
      // * [How Do I Create a Custom Schema Field Type?](howtos/custom-schema-field-types.md)
      // * [Sending email from your ApostropheCMS site](devops/email.md)
      // * [Storing Sessions in Redis](devops/storing-sessions-in-redis.md)
      // * [Running Apostrophe on multiple cores and/or servers](devops/multicore.md)
      // * [Running Apostrophe on Windows](devops/windows.md)
      // * [Building Docker images for Apostrophe projects](devops/docker.md)
      // * [Apostrophe Migration Guide](devops/migration.md)
      // * [Building a contact form in Apostrophe](howtos/forms.md)
      // * [Building combined menus and custom buttons with the admin bar](howtos/admin-bar.md)
      // * [How do I create a '404 not found' page?](howtos/how-do-i-create-a-404-not-found-page.md)
      // * [How do I add an Intranet to My Site?](howtos/intranet.md)
      // * [Configuring CKEditor in Apostrophe](howtos/ckeditor.md)
      // * [Facebook open graph tags in Apostrophe](howtos/facebook.md)
      // * [Sending user notifications](howtos/sending-user-notifications.md)
      // * [How do I Redirect a User on Login?](howtos/user-redirect.md)

      // ## Reference

      // * [Glossary](other/glossary.md)
      // * [Schema Field Types](other/field-types.md)
      //   * [area](other/field-types/area.md)
      //   * [array](other/field-types/array.md)
      //   * [attachment](other/field-types/attachment.md)
      //   * [boolean](other/field-types/boolean.md)
      //   * [checkboxes](other/field-types/checkbox.md)
      //   * [color](other/field-types/color.md)
      //   * [date](other/field-types/date.md)
      //   * [email](other/field-types/email.md)
      //   * [float](other/field-types/float.md)
      //   * [integer](other/field-types/integer.md)
      //   * [joinByArray](other/field-types/joinByArray.md)
      //   * [joinByArrayReverse](other/field-types/joinByArrayReverse.md)
      //   * [joinByOne](other/field-types/joinByOne.md)
      //   * [joinByOneReverse](other/field-types/joinByOneReverse.md)
      //   * [object](other/field-types/object.md)
      //   * [password](other/field-types/password.md)
      //   * [range](other/field-types/range.md)
      //   * [select](other/field-types/select.md)
      //   * [singleton](other/field-types/singleton.md)
      //   * [string](other/field-types/string.md)
      //   * [slug](other/field-types/slug.md)
      //   * [tags](other/field-types/tags.md)
      //   * [time](other/field-types/time.md)
      //   * [url](other/field-types/url.md)
      //   * [video](other/field-types/video.md)
      // * [Schema Field Properties](other/field-properties.md)
      //   * [choices](other/properties/choices.md)
      //   * [options](other/properties/options.md)
      //   * [sortify](other/properties/sortify.md)
      // * [Core Browser](other/core-browser.md)
      // * [Core Server](other/core-server.md)

      // * [Module Reference](modules/README.md)
      //   * [apostrophe-admin-bar](modules/apostrophe-admin-bar/README.md)
      //     * [apostrophe-admin-bar \(browser\)](modules/apostrophe-admin-bar/browser-apostrophe-admin-bar.md)
      //   * [apostrophe-any-page-manager](modules/apostrophe-any-page-manager/README.md)
      //     * [apostrophe-any-page-manager-cursor \(server\)](modules/apostrophe-any-page-manager/server-apostrophe-any-page-manager-cursor.md)
      //     * [apostrophe-any-page-manager-chooser \(browser\)](modules/apostrophe-any-page-manager/browser-apostrophe-any-page-manager-chooser.md)
      //     * [apostrophe-any-page-manager \(browser\)](modules/apostrophe-any-page-manager/browser-apostrophe-any-page-manager.md)
      //     * [apostrophe-any-page-manager-relationship-editor \(browser\)](modules/apostrophe-any-page-manager/browser-apostrophe-any-page-manager-relationship-editor.md)
      //   * [apostrophe-areas](modules/apostrophe-areas/README.md)
      //     * [apostrophe-areas \(browser\)](modules/apostrophe-areas/browser-apostrophe-areas.md)
      //     * [apostrophe-areas-editor \(browser\)](modules/apostrophe-areas/browser-apostrophe-areas-editor.md)
      //   * [apostrophe-assets](modules/apostrophe-assets/README.md)
      //     * [apostrophe-assets \(browser\)](modules/apostrophe-assets/browser-apostrophe-assets.md)
      //   * [apostrophe-attachments](modules/apostrophe-attachments/README.md)
      //     * [apostrophe-attachments \(browser\)](modules/apostrophe-attachments/browser-apostrophe-attachments.md)
      //     * [apostrophe-attachments-crop-editor \(browser\)](modules/apostrophe-attachments/browser-apostrophe-attachments-crop-editor.md)
      //     * [apostrophe-attachments-focal-point-editor \(browser\)](modules/apostrophe-attachments/browser-apostrophe-attachments-focal-point-editor.md)
      //   * [apostrophe-browser-utils](modules/apostrophe-browser-utils/README.md)
      //     * [apostrophe-browser-utils \(browser\)](modules/apostrophe-browser-utils/browser-apostrophe-browser-utils.md)
      //   * [apostrophe-caches](modules/apostrophe-caches/README.md)
      //   * [apostrophe-csrf](modules/apostrophe-csrf/README.md)
      //   * [apostrophe-custom-pages](modules/apostrophe-custom-pages/README.md)
      //     * [apostrophe-custom-pages-cursor \(server\)](modules/apostrophe-custom-pages/server-apostrophe-custom-pages-cursor.md)
      //     * [apostrophe-custom-pages \(browser\)](modules/apostrophe-custom-pages/browser-apostrophe-custom-pages.md)
      //     * [apostrophe-custom-pages-chooser \(browser\)](modules/apostrophe-custom-pages/browser-apostrophe-custom-pages-chooser.md)
      //     * [apostrophe-custom-pages-relationship-editor \(browser\)](modules/apostrophe-custom-pages/browser-apostrophe-custom-pages-relationship-editor.md)
      //   * [apostrophe-db](modules/apostrophe-db/README.md)
      //   * [apostrophe-doc-type-manager](modules/apostrophe-doc-type-manager/README.md)
      //     * [apostrophe-doc-type-manager-cursor \(server\)](modules/apostrophe-doc-type-manager/server-apostrophe-doc-type-manager-cursor.md)
      //     * [apostrophe-doc-type-manager \(browser\)](modules/apostrophe-doc-type-manager/browser-apostrophe-doc-type-manager.md)
      //     * [apostrophe-doc-type-manager-chooser \(browser\)](modules/apostrophe-doc-type-manager/browser-apostrophe-doc-type-manager-chooser.md)
      //     * [apostrophe-doc-type-manager-relationship-editor \(browser\)](modules/apostrophe-doc-type-manager/browser-apostrophe-doc-type-manager-relationship-editor.md)
      //     * [apostrophe-doc-type-manager-manager-modal \(browser\)](modules/apostrophe-doc-type-manager/browser-apostrophe-doc-type-manager-manager-modal.md)
      //   * [apostrophe-docs](modules/apostrophe-docs/README.md)
      //     * [apostrophe-cursor \(server\)](modules/apostrophe-docs/server-apostrophe-cursor.md)
      //     * [apostrophe-docs \(browser\)](modules/apostrophe-docs/browser-apostrophe-docs.md)
      //   * [apostrophe-email](modules/apostrophe-email/README.md)
      //   * [apostrophe-express](modules/apostrophe-express/README.md)
      //   * [apostrophe-files](modules/apostrophe-files/README.md)
      //     * [apostrophe-files-cursor \(server\)](modules/apostrophe-files/server-apostrophe-files-cursor.md)
      //     * [apostrophe-files \(browser\)](modules/apostrophe-files/browser-apostrophe-files.md)
      //     * [apostrophe-files-editor-modal \(browser\)](modules/apostrophe-files/browser-apostrophe-files-editor-modal.md)
      //     * [apostrophe-files-chooser \(browser\)](modules/apostrophe-files/browser-apostrophe-files-chooser.md)
      //     * [apostrophe-files-relationship-editor \(browser\)](modules/apostrophe-files/browser-apostrophe-files-relationship-editor.md)
      //     * [apostrophe-files-manager-modal \(browser\)](modules/apostrophe-files/browser-apostrophe-files-manager-modal.md)
      //   * [apostrophe-files-widgets](modules/apostrophe-files-widgets/README.md)
      //     * [apostrophe-files-widgets \(browser\)](modules/apostrophe-files-widgets/browser-apostrophe-files-widgets.md)
      //     * [apostrophe-files-widgets-editor \(browser\)](modules/apostrophe-files-widgets/browser-apostrophe-files-widgets-editor.md)
      //   * [apostrophe-global](modules/apostrophe-global/README.md)
      //     * [apostrophe-global-cursor \(server\)](modules/apostrophe-global/server-apostrophe-global-cursor.md)
      //     * [apostrophe-global \(browser\)](modules/apostrophe-global/browser-apostrophe-global.md)
      //     * [apostrophe-global-chooser \(browser\)](modules/apostrophe-global/browser-apostrophe-global-chooser.md)
      //     * [apostrophe-global-relationship-editor \(browser\)](modules/apostrophe-global/browser-apostrophe-global-relationship-editor.md)
      //     * [apostrophe-global-editor-modal \(browser\)](modules/apostrophe-global/browser-apostrophe-global-editor-modal.md)
      //     * [apostrophe-global-manager-modal \(browser\)](modules/apostrophe-global/browser-apostrophe-global-manager-modal.md)
      //   * [apostrophe-groups](modules/apostrophe-groups/README.md)
      //     * [apostrophe-groups-cursor \(server\)](modules/apostrophe-groups/server-apostrophe-groups-cursor.md)
      //     * [apostrophe-groups \(browser\)](modules/apostrophe-groups/browser-apostrophe-groups.md)
      //     * [apostrophe-groups-chooser \(browser\)](modules/apostrophe-groups/browser-apostrophe-groups-chooser.md)
      //     * [apostrophe-groups-relationship-editor \(browser\)](modules/apostrophe-groups/browser-apostrophe-groups-relationship-editor.md)
      //     * [apostrophe-groups-editor-modal \(browser\)](modules/apostrophe-groups/browser-apostrophe-groups-editor-modal.md)
      //     * [apostrophe-groups-manager-modal \(browser\)](modules/apostrophe-groups/browser-apostrophe-groups-manager-modal.md)
      //   * [apostrophe-html-widgets](modules/apostrophe-html-widgets/README.md)
      //     * [apostrophe-html-widgets \(browser\)](modules/apostrophe-html-widgets/browser-apostrophe-html-widgets.md)
      //     * [apostrophe-html-widgets-editor \(browser\)](modules/apostrophe-html-widgets/browser-apostrophe-html-widgets-editor.md)
      //   * [apostrophe-i18n](modules/apostrophe-i18n/README.md)
      //   * [apostrophe-images](modules/apostrophe-images/README.md)
      //     * [apostrophe-images-cursor \(server\)](modules/apostrophe-images/server-apostrophe-images-cursor.md)
      //     * [apostrophe-images-chooser \(browser\)](modules/apostrophe-images/browser-apostrophe-images-chooser.md)
      //     * [apostrophe-images-relationship-editor \(browser\)](modules/apostrophe-images/browser-apostrophe-images-relationship-editor.md)
      //     * [apostrophe-images-manager-modal \(browser\)](modules/apostrophe-images/browser-apostrophe-images-manager-modal.md)
      //     * [apostrophe-images-editor-modal \(browser\)](modules/apostrophe-images/browser-apostrophe-images-editor-modal.md)
      //     * [apostrophe-images-focal-point-editor \(browser\)](modules/apostrophe-images/browser-apostrophe-images-focal-point-editor.md)
      //     * [apostrophe-images \(browser\)](modules/apostrophe-images/browser-apostrophe-images.md)
      //   * [apostrophe-images-widgets](modules/apostrophe-images-widgets/README.md)
      //     * [apostrophe-images-widgets \(browser\)](modules/apostrophe-images-widgets/browser-apostrophe-images-widgets.md)
      //     * [apostrophe-images-widgets-editor \(browser\)](modules/apostrophe-images-widgets/browser-apostrophe-images-widgets-editor.md)
      //   * [apostrophe-jobs](modules/apostrophe-jobs/README.md)
      //     * [apostrophe-jobs \(browser\)](modules/apostrophe-jobs/browser-apostrophe-jobs.md)
      //     * [apostrophe-jobs-modal \(browser\)](modules/apostrophe-jobs/browser-apostrophe-jobs-modal.md)
      //   * [apostrophe-launder](modules/apostrophe-launder/README.md)
      //   * [apostrophe-locks](modules/apostrophe-locks/README.md)
      //   * [apostrophe-login](modules/apostrophe-login/README.md)
      //   * [apostrophe-migrations](modules/apostrophe-migrations/README.md)
      //   * [apostrophe-modal](modules/apostrophe-modal/README.md)
      //     * [apostrophe-modal \(browser\)](modules/apostrophe-modal/browser-apostrophe-modal.md)
      //   * [apostrophe-module](modules/apostrophe-module/README.md)
      //     * [apostrophe-module \(browser\)](modules/apostrophe-module/browser-apostrophe-module.md)
      //     * [apostrophe-module-manager-modal \(browser\)](modules/apostrophe-module/browser-apostrophe-module-manager-modal.md)
      //     * [apostrophe-module-editor \(browser\)](modules/apostrophe-module/browser-apostrophe-module-editor.md)
      //   * [apostrophe-notifications](modules/apostrophe-notifications/README.md)
      //     * [apostrophe-notifications \(browser\)](modules/apostrophe-notifications/browser-apostrophe-notifications.md)
      //   * [apostrophe-oembed](modules/apostrophe-oembed/README.md)
      //     * [apostrophe-oembed \(browser\)](modules/apostrophe-oembed/browser-apostrophe-oembed.md)
      //   * [apostrophe-pager](modules/apostrophe-pager/README.md)
      //   * [apostrophe-pages](modules/apostrophe-pages/README.md)
      //     * [apostrophe-pages-cursor \(server\)](modules/apostrophe-pages/server-apostrophe-pages-cursor.md)
      //     * [apostrophe-pages \(browser\)](modules/apostrophe-pages/browser-apostrophe-pages.md)
      //     * [apostrophe-pages-editor \(browser\)](modules/apostrophe-pages/browser-apostrophe-pages-editor.md)
      //     * [apostrophe-pages-editor-update \(browser\)](modules/apostrophe-pages/browser-apostrophe-pages-editor-update.md)
      //     * [apostrophe-pages-editor-copy \(browser\)](modules/apostrophe-pages/browser-apostrophe-pages-editor-copy.md)
      //     * [apostrophe-pages-reorganize \(browser\)](modules/apostrophe-pages/browser-apostrophe-pages-reorganize.md)
      //   * [apostrophe-permissions](modules/apostrophe-permissions/README.md)
      //   * [apostrophe-pieces](modules/apostrophe-pieces/README.md)
      //     * [apostrophe-pieces-cursor \(server\)](modules/apostrophe-pieces/server-apostrophe-pieces-cursor.md)
      //     * [apostrophe-pieces \(browser\)](modules/apostrophe-pieces/browser-apostrophe-pieces.md)
      //     * [apostrophe-pieces-manager-modal \(browser\)](modules/apostrophe-pieces/browser-apostrophe-pieces-manager-modal.md)
      //     * [apostrophe-pieces-editor-modal \(browser\)](modules/apostrophe-pieces/browser-apostrophe-pieces-editor-modal.md)
      //     * [apostrophe-pieces-batch-permissions-modal \(browser\)](modules/apostrophe-pieces/browser-apostrophe-pieces-batch-permissions-modal.md)
      //     * [apostrophe-pieces-chooser \(browser\)](modules/apostrophe-pieces/browser-apostrophe-pieces-chooser.md)
      //     * [apostrophe-pieces-relationship-editor \(browser\)](modules/apostrophe-pieces/browser-apostrophe-pieces-relationship-editor.md)
      //   * [apostrophe-pieces-pages](modules/apostrophe-pieces-pages/README.md)
      //     * [apostrophe-pieces-pages-cursor \(server\)](modules/apostrophe-pieces-pages/server-apostrophe-pieces-pages-cursor.md)
      //     * [apostrophe-pieces-pages \(browser\)](modules/apostrophe-pieces-pages/browser-apostrophe-pieces-pages.md)
      //     * [apostrophe-pieces-pages-chooser \(browser\)](modules/apostrophe-pieces-pages/browser-apostrophe-pieces-pages-chooser.md)
      //     * [apostrophe-pieces-pages-relationship-editor \(browser\)](modules/apostrophe-pieces-pages/browser-apostrophe-pieces-pages-relationship-editor.md)
      //   * [apostrophe-pieces-widgets](modules/apostrophe-pieces-widgets/README.md)
      //     * [apostrophe-pieces-widgets-editor \(browser\)](modules/apostrophe-pieces-widgets/browser-apostrophe-pieces-widgets-editor.md)
      //     * [apostrophe-pieces-widgets \(browser\)](modules/apostrophe-pieces-widgets/browser-apostrophe-pieces-widgets.md)
      //   * [apostrophe-polymorphic-manager](modules/apostrophe-polymorphic-manager/README.md)
      //     * [apostrophe-polymorphic-manager-cursor \(server\)](modules/apostrophe-polymorphic-manager/server-apostrophe-polymorphic-manager-cursor.md)
      //     * [apostrophe-polymorphic-manager-manager-modal \(browser\)](modules/apostrophe-polymorphic-manager/browser-apostrophe-polymorphic-manager-manager-modal.md)
      //     * [apostrophe-polymorphic-manager-chooser \(browser\)](modules/apostrophe-polymorphic-manager/browser-apostrophe-polymorphic-manager-chooser.md)
      //     * [apostrophe-polymorphic-manager \(browser\)](modules/apostrophe-polymorphic-manager/browser-apostrophe-polymorphic-manager.md)
      //     * [apostrophe-polymorphic-manager-relationship-editor \(browser\)](modules/apostrophe-polymorphic-manager/browser-apostrophe-polymorphic-manager-relationship-editor.md)
      //   * [apostrophe-push](modules/apostrophe-push/README.md)
      //   * [apostrophe-rich-text-widgets](modules/apostrophe-rich-text-widgets/README.md)
      //     * [apostrophe-rich-text-widgets \(browser\)](modules/apostrophe-rich-text-widgets/browser-apostrophe-rich-text-widgets.md)
      //     * [apostrophe-rich-text-widgets-editor \(browser\)](modules/apostrophe-rich-text-widgets/browser-apostrophe-rich-text-widgets-editor.md)
      //   * [apostrophe-schemas](modules/apostrophe-schemas/README.md)
      //     * [apostrophe-schemas \(browser\)](modules/apostrophe-schemas/browser-apostrophe-schemas.md)
      //     * [apostrophe-array-editor-modal \(browser\)](modules/apostrophe-schemas/browser-apostrophe-array-editor-modal.md)
      //   * [apostrophe-search](modules/apostrophe-search/README.md)
      //     * [apostrophe-search-cursor \(server\)](modules/apostrophe-search/server-apostrophe-search-cursor.md)
      //     * [apostrophe-search \(browser\)](modules/apostrophe-search/browser-apostrophe-search.md)
      //     * [apostrophe-search-chooser \(browser\)](modules/apostrophe-search/browser-apostrophe-search-chooser.md)
      //     * [apostrophe-search-relationship-editor \(browser\)](modules/apostrophe-search/browser-apostrophe-search-relationship-editor.md)
      //   * [apostrophe-service-bridge](modules/apostrophe-service-bridge/README.md)
      //   * [apostrophe-soft-redirects](modules/apostrophe-soft-redirects/README.md)
      //   * [apostrophe-tags](modules/apostrophe-tags/README.md)
      //     * [apostrophe-tags-cursor \(server\)](modules/apostrophe-tags/server-apostrophe-tags-cursor.md)
      //     * [apostrophe-tags \(browser\)](modules/apostrophe-tags/browser-apostrophe-tags.md)
      //     * [apostrophe-tags-manager-modal \(browser\)](modules/apostrophe-tags/browser-apostrophe-tags-manager-modal.md)
      //     * [apostrophe-tags-chooser \(browser\)](modules/apostrophe-tags/browser-apostrophe-tags-chooser.md)
      //     * [apostrophe-tags-relationship-editor \(browser\)](modules/apostrophe-tags/browser-apostrophe-tags-relationship-editor.md)
      //     * [apostrophe-tags-editor-modal \(browser\)](modules/apostrophe-tags/browser-apostrophe-tags-editor-modal.md)
      //   * [apostrophe-tasks](modules/apostrophe-tasks/README.md)
      //   * [apostrophe-templates](modules/apostrophe-templates/README.md)
      //   * [apostrophe-ui](modules/apostrophe-ui/README.md)
      //     * [apostrophe-ui \(browser\)](modules/apostrophe-ui/browser-apostrophe-ui.md)
      //   * [apostrophe-urls](modules/apostrophe-urls/README.md)
      //   * [apostrophe-users](modules/apostrophe-users/README.md)
      //     * [apostrophe-users-cursor \(server\)](modules/apostrophe-users/server-apostrophe-users-cursor.md)
      //     * [apostrophe-users \(browser\)](modules/apostrophe-users/browser-apostrophe-users.md)
      //     * [apostrophe-users-editor-modal \(browser\)](modules/apostrophe-users/browser-apostrophe-users-editor-modal.md)
      //     * [apostrophe-users-chooser \(browser\)](modules/apostrophe-users/browser-apostrophe-users-chooser.md)
      //     * [apostrophe-users-relationship-editor \(browser\)](modules/apostrophe-users/browser-apostrophe-users-relationship-editor.md)
      //     * [apostrophe-users-manager-modal \(browser\)](modules/apostrophe-users/browser-apostrophe-users-manager-modal.md)
      //   * [apostrophe-utils](modules/apostrophe-utils/README.md)
      //     * [apostrophe-context \(browser\)](modules/apostrophe-utils/browser-apostrophe-context.md)
      //   * [apostrophe-versions](modules/apostrophe-versions/README.md)
      //     * [apostrophe-versions \(browser\)](modules/apostrophe-versions/browser-apostrophe-versions.md)
      //     * [apostrophe-versions-editor \(browser\)](modules/apostrophe-versions/browser-apostrophe-versions-editor.md)
      //   * [apostrophe-video-fields](modules/apostrophe-video-fields/README.md)
      //     * [apostrophe-video-fields \(browser\)](modules/apostrophe-video-fields/browser-apostrophe-video-fields.md)
      //   * [apostrophe-video-widgets](modules/apostrophe-video-widgets/README.md)
      //     * [apostrophe-video-widgets \(browser\)](modules/apostrophe-video-widgets/browser-apostrophe-video-widgets.md)
      //     * [apostrophe-video-widgets-editor \(browser\)](modules/apostrophe-video-widgets/browser-apostrophe-video-widgets-editor.md)
      //   * [apostrophe-widgets](modules/apostrophe-widgets/README.md)
      //     * [apostrophe-widgets \(browser\)](modules/apostrophe-widgets/browser-apostrophe-widgets.md)
      //     * [apostrophe-widgets-editor \(browser\)](modules/apostrophe-widgets/browser-apostrophe-widgets-editor.md)
    ]
  }
};
